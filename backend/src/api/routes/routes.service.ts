import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { BaseRoute } from 'src/types/route.type';

@Injectable()
export class RouteService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getRoutes(tripId: number) {
    const trip = await this.databaseService.trip.findUnique({ where: { id: tripId, isDeleted: false } });
    if (!trip) {
      throw new HttpException('Trip ID is required.', HttpStatus.BAD_REQUEST);
    }

    const routes = await this.databaseService.route.findMany({
      where: {
        OR: [
          {
            startingPoint: {
              place: {
                tripId,
              },
              isDeleted: false,
            },
          },
          {
            destination: {
              place: {
                tripId,
              },
              isDeleted: false,
            },
          },
        ],
        isDeleted: false,
      },
      select: {
        id: true,
        travelMode: true,
        duration: true,
        distance: true,
        path: true,
        startingPoint: {
          select: {
            id: true,
          },
        },
        destination: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const result = routes.map(({ startingPoint, destination, ...others }) => {
      return { ...others, startingPlaceId: startingPoint.id, destinationPlaceId: destination.id };
    });

    return result;
  }

  async createRoute({ startingPointId, destinationId, travelMode, duration, distance, path }: BaseRoute) {
    const placeDurations = await this.databaseService.placeDuration.findMany({
      where: {
        OR: [{ id: startingPointId }, { id: destinationId }],
        isDeleted: false,
      },
      include: {
        place: true,
      },
    });

    if (placeDurations.length !== 2) {
      throw new HttpException('Starting point or destination not found.', HttpStatus.BAD_REQUEST);
    }

    const route = await this.databaseService.route.create({
      data: {
        startingPointId,
        destinationId,
        travelMode,
        duration,
        distance,
        path,
      },
    });

    return route;
  }

  async updateRoute(id: number, { travelMode, duration, distance, path }: BaseRoute) {
    const existingRoute = await this.databaseService.route.findUnique({ where: { id, isDeleted: false } });
    if (!existingRoute) {
      throw new HttpException('Route ID is required.', HttpStatus.BAD_REQUEST);
    }

    const updatedRoute = await this.databaseService.route.update({
      where: { id, isDeleted: false },
      data: {
        travelMode,
        duration,
        distance,
        path,
      },
    });

    return updatedRoute;
  }

  async deleteRoute(id: number) {
    const existingRoute = await this.databaseService.route.findUnique({ where: { id } });
    if (!existingRoute) {
      throw new HttpException('Route ID is required.', HttpStatus.BAD_REQUEST);
    }

    const deletedRoute = await this.databaseService.route.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    return deletedRoute.id;
  }

  async deleteRouteByPlaceDuration(placeDurationId: number) {
    const deletedRoutes = await this.databaseService.route.updateMany({
      where: {
        OR: [{ startingPointId: placeDurationId }, { destinationId: placeDurationId }],
        isDeleted: false,
      },
      data: {
        isDeleted: true,
      },
    });

    return deletedRoutes;
  }
}
