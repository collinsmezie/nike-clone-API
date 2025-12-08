import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ProductFilterDto } from './dto/product-filter.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filterDto: ProductFilterDto) {
    const {
      category,
      size,
      color,
      minPrice,
      maxPrice,
      search,
      gender,
      sport,
      shoeHeight,
      skip = 0,
      take = 20,
    } = filterDto;

    const where: Prisma.ProductWhereInput = {};

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
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    // For size and color, we need to filter products that have these options
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

  async findOne(id: string) {
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

  async getRecommendations(productId: string) {
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
}
