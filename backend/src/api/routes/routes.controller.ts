import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/api/auth/auth.guard';
import { TripGuard } from '../trips/trip.guard';
import { RouteService } from './routes.service';
import { RequiredPermission } from 'src/decorators/required-permission.decorator';
import { PermissionsText } from 'src/types/tripMember.type';
import { BaseRouteDto, UpdatedRouteDto } from './route.dto';
import { NamespaceType } from 'src/types/webSocket.type';
import { WebSocketService } from 'src/webSocket/webSocket.service';

@Controller('trips/:tripId/routes')
@UseGuards(AuthGuard, TripGuard)
export class RouteController {
  constructor(
    private readonly routeService: RouteService,
    private readonly webSocketService: WebSocketService,
  ) {}

  private async broadcastRoutes(tripId: number) {
    try {
      const routes = await this.routeService.getRoutes(tripId);
      await this.webSocketService.emitToRoom(
        tripId,
        'routes',
        {
          data: routes,
        },
        NamespaceType.Routes,
      );
    } catch (error) {
      console.error(`Failed to broadcast routes for trip ${tripId}: ${error.message}`);
    }
  }

  @Get('')
  @RequiredPermission(PermissionsText.VIEWER)
  async getRoutes(@Param('tripId') tripId: number) {
    const routes = await this.routeService.getRoutes(tripId);

    return { date: routes ?? [] };
  }

  @Post('')
  @RequiredPermission(PermissionsText.EDITOR)
  async createRoute(@Param('tripId') tripId: number, @Body() routeDto: BaseRouteDto) {
    const route = await this.routeService.createRoute(routeDto);

    await this.broadcastRoutes(tripId);

    return { date: route };
  }

  @Put('/:routeId')
  @RequiredPermission(PermissionsText.EDITOR)
  async updateRoute(@Param('tripId') tripId: number, @Param('routeId') routeId: number, @Body() routeDto: UpdatedRouteDto) {
    await this.routeService.updateRoute(routeId, routeDto);

    await this.broadcastRoutes(tripId);

    return { message: 'Route Updated successfully' };
  }

  @Delete('/:routeId')
  @RequiredPermission(PermissionsText.EDITOR)
  async deleteRoute(@Param('tripId') tripId: number, @Param('routeId') routeId: number) {
    await this.routeService.deleteRoute(routeId);

    await this.broadcastRoutes(tripId);

    return { message: 'Route Deleted successfully' };
  }
}
