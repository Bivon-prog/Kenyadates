import {
  Controller, Get, Post, Put, Delete, Patch,
  Body, Param, Query, Req, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '@prisma/client';
import { AdminService } from './admin.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  // ── DASHBOARD ──────────────────────────────────────────────────
  @Get('stats')
  @ApiOperation({ summary: 'Get full platform dashboard stats' })
  getStats() {
    return this.adminService.getDashboardStats();
  }

  // ── USERS ──────────────────────────────────────────────────────
  @Get('users')
  @ApiOperation({ summary: 'List all users with filters & pagination' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'role', required: false })
  @ApiQuery({ name: 'verified', required: false })
  getUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('verified') verified?: string,
  ) {
    return this.adminService.getAllUsers(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      search,
      role,
      verified,
    );
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get single user full details' })
  getUser(@Param('id') id: string) {
    return this.adminService.getUserById(id);
  }

  @Post('users')
  @ApiOperation({ summary: 'Create a new user (admin or agent account)' })
  createUser(@Body() body: {
    email: string;
    password: string;
    displayName: string;
    age: number;
    gender: string;
    city: string;
    county: string;
    role?: Role;
    phoneNumber?: string;
  }) {
    return this.adminService.createUser(body);
  }

  @Patch('users/:id/role')
  @ApiOperation({ summary: 'Change user role (USER / ADMIN / MODERATOR/AGENT)' })
  updateRole(@Param('id') id: string, @Body() body: { role: Role }) {
    return this.adminService.updateUserRole(id, body.role);
  }

  @Patch('users/:id/verify')
  @ApiOperation({ summary: 'Manually grant verified badge + 50 coins' })
  verifyUser(@Param('id') id: string) {
    return this.adminService.verifyUser(id);
  }

  @Patch('users/:id/ban')
  @ApiOperation({ summary: 'Ban a user (blocks login)' })
  banUser(@Param('id') id: string, @Body() body: { reason?: string }) {
    return this.adminService.banUser(id, body.reason);
  }

  @Patch('users/:id/unban')
  @ApiOperation({ summary: 'Unban a user' })
  unbanUser(@Param('id') id: string) {
    return this.adminService.unbanUser(id);
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Permanently delete a user' })
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  @Patch('users/:id/coins')
  @ApiOperation({ summary: 'Add or deduct coins from a user wallet' })
  adjustCoins(
    @Param('id') id: string,
    @Body() body: { amount: number; reason?: string },
  ) {
    return this.adminService.adjustCoins(id, body.amount, body.reason);
  }

  // ── REPORTS ────────────────────────────────────────────────────
  @Get('reports')
  @ApiOperation({ summary: 'Get all user reports' })
  @ApiQuery({ name: 'resolved', required: false })
  @ApiQuery({ name: 'page', required: false })
  getReports(
    @Query('resolved') resolved?: string,
    @Query('page') page?: string,
  ) {
    const resolvedBool = resolved === 'true' ? true : resolved === 'false' ? false : undefined;
    return this.adminService.getReports(resolvedBool, page ? parseInt(page) : 1);
  }

  @Patch('reports/:id/resolve')
  @ApiOperation({ summary: 'Mark a report as resolved' })
  resolveReport(@Param('id') id: string) {
    return this.adminService.resolveReport(id);
  }

  // ── COIN PACKAGES ──────────────────────────────────────────────
  @Get('packages')
  @ApiOperation({ summary: 'Get all coin packages' })
  getPackages() {
    return this.adminService.getCoinPackages();
  }

  @Put('packages')
  @ApiOperation({ summary: 'Create or update a coin package' })
  upsertPackage(@Body() body: { id?: string; name: string; priceKsh: number; coins: number; bonusCoins?: number }) {
    return this.adminService.upsertCoinPackage(body);
  }

  @Delete('packages/:id')
  @ApiOperation({ summary: 'Delete a coin package' })
  deletePackage(@Param('id') id: string) {
    return this.adminService.deleteCoinPackage(id);
  }

  // ── MEMBERSHIP PLANS ───────────────────────────────────────────
  @Get('plans')
  @ApiOperation({ summary: 'Get all membership plans' })
  getPlans() {
    return this.adminService.getMembershipPlans();
  }

  @Put('plans')
  @ApiOperation({ summary: 'Create or update a membership plan' })
  upsertPlan(@Body() body: { id?: string; name: string; priceKsh: number; monthlyCoins: number; benefits?: any }) {
    return this.adminService.upsertMembershipPlan(body);
  }

  // ── TRANSACTIONS ───────────────────────────────────────────────
  @Get('transactions')
  @ApiOperation({ summary: 'Get all M-Pesa payment transactions' })
  getTransactions(@Query('page') page?: string) {
    return this.adminService.getTransactions(page ? parseInt(page) : 1);
  }

  // ── SEED SUPER ADMIN ───────────────────────────────────────────
  @Post('seed')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create or promote a super admin account' })
  seedAdmin(@Body() body: { email: string; password: string; name: string }) {
    return this.adminService.seedSuperAdmin(body.email, body.password, body.name);
  }
}
