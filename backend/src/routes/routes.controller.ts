import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { TripGuard } from 'src/trips/trip.guard';
import { RouteService } from './routes.service';
import { RequiredPermission } from 'src/decorators/required-permission.decorator';
import { PermissionsText } from 'src/types/tripMember.type';
import { BaseRouteDto, UpdatedRouteDto } from './route.dto';

@Controller('trips/:tripId/routes')
@UseGuards(AuthGuard, TripGuard)
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @Get('')
  @RequiredPermission(PermissionsText.VIEWER)
  async getRoute(@Param('tripId') tripId: number) {
    const route = await this.routeService.getRoute(tripId);

    return { date: route ?? [] };
  }

  @Post('')
  @RequiredPermission(PermissionsText.EDITOR)
  async createRoute(@Body() routeDto: BaseRouteDto) {
    const route = await this.routeService.createRoute(routeDto);

    return { date: { route } };
  }

  @Put('/:routeId')
  @RequiredPermission(PermissionsText.EDITOR)
  async updateRoute(@Param('routeId') routeId: number, @Body() routeDto: UpdatedRouteDto) {
    await this.routeService.updateRoute(routeId, routeDto);

    return { message: 'Route Updated successfully' };
  }

  @Delete('/:routeId')
  @RequiredPermission(PermissionsText.EDITOR)
  async deleteRoute(@Param('routeId') routeId: number) {
    await this.routeService.deleteRoute(routeId);

    return { message: 'Route Deleted successfully' };
  }
}
