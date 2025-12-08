"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let ProductsService = class ProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(filterDto) {
        const { category, size, color, minPrice, maxPrice, search, gender, sport, shoeHeight, skip = 0, take = 20, } = filterDto;
        const where = {};
        if (category) {
            where.category = { contains: category };
        }
        if (gender) {
            where.gender = { equals: gender };
        }
        if (sport) {
            where.sport = { equals: sport };
        }
        if (shoeHeight) {
            where.shoeHeight = { equals: shoeHeight };
        }
        if (search) {
            where.OR = [
                { name: { contains: search } },
                { description: { contains: search } },
            ];
        }
        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = {};
            if (minPrice !== undefined)
                where.price.gte = minPrice;
            if (maxPrice !== undefined)
                where.price.lte = maxPrice;
        }
        if (size) {
            where.sizes = {
                some: {
                    size: size,
                    inStock: true,
                },
            };
        }
        if (color) {
            where.colors = {
                some: {
                    name: { contains: color },
                },
            };
        }
        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip,
                take,
                include: {
                    images: {
                        where: { isPrimary: true },
                        take: 1,
                    },
                    colors: true,
                    sizes: {
                        where: { inStock: true },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            this.prisma.product.count({ where }),
        ]);
        return {
            products,
            total,
            skip,
            take,
        };
    }
    async findOne(id) {
        return this.prisma.product.findUnique({
            where: { id },
            include: {
                images: true,
                colors: true,
                sizes: true,
                details: true,
                reviews: {
                    include: {
                        user: {
                            select: {
                                fullName: true,
                            },
                        },
                    },
                },
            },
        });
    }
    async getRecommendations(productId) {
        const count = await this.prisma.product.count();
        const skip = Math.floor(Math.random() * Math.max(0, count - 4));
        return this.prisma.product.findMany({
            where: {
                id: { not: productId },
            },
            take: 4,
            skip: skip,
            include: {
                images: {
                    where: { isPrimary: true },
                    take: 1,
                },
            },
        });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map