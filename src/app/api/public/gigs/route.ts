import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import Gig from '@/models/Gig';
import {
  handleApiError,
  createSuccessResponse,
} from '@/middleware/errorHandler';
import {
  parseQueryParams,
  createPaginationInfo,
  buildSearchQuery,
  buildSortQuery,
} from '@/utils/helpers';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const { page, limit, search, sort } = parseQueryParams(searchParams);

    // Additional filters
    const skillsFilter = searchParams.get('skills');
    const locationFilter = searchParams.get('location');
    const minSalary = searchParams.get('minSalary');
    const maxSalary = searchParams.get('maxSalary');

    // Build query
    const query: any = {};

    if (search) {
      const searchQuery = buildSearchQuery(search, [
        'title',
        'description',
        'skillsRequired',
      ]);
      Object.assign(query, searchQuery);
    }

    if (skillsFilter) {
      const skills = skillsFilter.split(',').map((skill) => skill.trim());
      query.skillsRequired = { $in: skills };
    }

    if (locationFilter) {
      const [city, state] = locationFilter
        .split(',')
        .map((part) => part.trim());
      if (city) query['location.city'] = new RegExp(city, 'i');
      if (state) query['location.state'] = new RegExp(state, 'i');
    }

    if (minSalary || maxSalary) {
      query.salary = {};
      if (minSalary) query.salary.$gte = parseFloat(minSalary);
      if (maxSalary) query.salary.$lte = parseFloat(maxSalary);
    }

    const sortQuery = buildSortQuery(sort);

    // Get total count
    const total = await Gig.countDocuments(query);

    // Get gigs with pagination
    const gigs = await Gig.find(query)
      .populate('startupId', 'companyName workSector location')
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Transform gigs data to ensure consistent field names
    const transformedGigs = gigs.map((gig) => {
      const transformed = {
        ...gig,
        // If populate worked, get company name from startupId
        company: gig.startupId?.companyName || '',
        // Ensure consistency in skill field names
        skillsRequired: gig.skillsRequired || [],
      };

      return transformed;
    });

    const pagination = createPaginationInfo(page, limit, total);

    return createSuccessResponse({
      Gigs: transformedGigs,
      pagination,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
