import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db/mongodb';
import Machine from '@/models/Machine';
import Manufacturer from '@/models/Manufacturer'; // Import Manufacturer model for population
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

    // Ensure Manufacturer model is registered for population
    if (!mongoose.models.Manufacturer) {
      require('@/models/Manufacturer');
    }

    const { searchParams } = new URL(request.url);
    const { page, limit, search, sort } = parseQueryParams(searchParams);

    // Additional filters
    const typeFilter = searchParams.get('type');
    const locationFilter = searchParams.get('location');
    const availableOnly = searchParams.get('available') === 'true';

    // Build query
    const query: any = {};

    // Only show available machines for public API
    if (availableOnly !== false) {
      query.available = true;
    }

    if (search) {
      const searchQuery = buildSearchQuery(search, [
        'name',
        'type',
        'description',
      ]);
      Object.assign(query, searchQuery);
    }

    if (typeFilter) {
      query.type = new RegExp(typeFilter, 'i');
    }

    if (locationFilter) {
      const [city, state] = locationFilter
        .split(',')
        .map((part) => part.trim());
      if (city) query['location.city'] = new RegExp(city, 'i');
      if (state) query['location.state'] = new RegExp(state, 'i');
    }

    const sortQuery = buildSortQuery(sort);

    // Get total count
    const total = await Machine.countDocuments(query);

    // Get machines with pagination
    const machines = await Machine.find(query)
      .populate('manufacturerId', 'companyName workSector location')
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const pagination = createPaginationInfo(page, limit, total);

    return createSuccessResponse({
      Machines: machines,
      pagination,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
