import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma.service';
import { ProductFilterDto } from './dto/product-filter.dto';

describe('ProductsService', () => {
  let service: ProductsService;
  let prismaService: any;

  const mockProduct = {
    id: 'product-id-123',
    name: 'Nike Air Max',
    category: "Men's Shoes",
    price: 120,
    description: 'Great shoes',
    rating: 4.5,
    reviewCount: 100,
    style: 'NK-123',
    badge: null,
    gender: 'Men',
    sport: 'Running',
    shoeHeight: 'Low Top',
    isHighlyRated: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    images: [],
    colors: [],
    sizes: [],
  };

  beforeEach(async () => {
    const mockPrismaService = {
      product: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prismaService = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return products with default pagination', async () => {
      const filterDto: ProductFilterDto = {};
      prismaService.product.findMany.mockResolvedValue([mockProduct]);
      prismaService.product.count.mockResolvedValue(1);

      const result = await service.findAll(filterDto);

      expect(prismaService.product.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 20,
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
      });
      expect(result).toEqual({
        products: [mockProduct],
        total: 1,
        skip: 0,
        take: 20,
      });
    });

    it('should filter by category', async () => {
      const filterDto: ProductFilterDto = { category: "Men's Shoes" };
      prismaService.product.findMany.mockResolvedValue([mockProduct]);
      prismaService.product.count.mockResolvedValue(1);

      await service.findAll(filterDto);

      expect(prismaService.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            category: { contains: "Men's Shoes" },
          }),
        }),
      );
    });

    it('should filter by gender', async () => {
      const filterDto: ProductFilterDto = { gender: 'Men' };
      prismaService.product.findMany.mockResolvedValue([mockProduct]);
      prismaService.product.count.mockResolvedValue(1);

      await service.findAll(filterDto);

      expect(prismaService.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            gender: { equals: 'Men' },
          }),
        }),
      );
    });

    it('should filter by sport', async () => {
      const filterDto: ProductFilterDto = { sport: 'Running' };
      prismaService.product.findMany.mockResolvedValue([mockProduct]);
      prismaService.product.count.mockResolvedValue(1);

      await service.findAll(filterDto);

      expect(prismaService.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            sport: { equals: 'Running' },
          }),
        }),
      );
    });

    it('should filter by price range', async () => {
      const filterDto: ProductFilterDto = { minPrice: 100, maxPrice: 150 };
      prismaService.product.findMany.mockResolvedValue([mockProduct]);
      prismaService.product.count.mockResolvedValue(1);

      await service.findAll(filterDto);

      expect(prismaService.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            price: {
              gte: 100,
              lte: 150,
            },
          }),
        }),
      );
    });

    it('should filter by minPrice only', async () => {
      const filterDto: ProductFilterDto = { minPrice: 100 };
      prismaService.product.findMany.mockResolvedValue([mockProduct]);
      prismaService.product.count.mockResolvedValue(1);

      await service.findAll(filterDto);

      expect(prismaService.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            price: {
              gte: 100,
            },
          }),
        }),
      );
    });

    it('should filter by maxPrice only', async () => {
      const filterDto: ProductFilterDto = { maxPrice: 150 };
      prismaService.product.findMany.mockResolvedValue([mockProduct]);
      prismaService.product.count.mockResolvedValue(1);

      await service.findAll(filterDto);

      expect(prismaService.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            price: {
              lte: 150,
            },
          }),
        }),
      );
    });

    it('should filter by search query (name or description)', async () => {
      const filterDto: ProductFilterDto = { search: 'Nike' };
      prismaService.product.findMany.mockResolvedValue([mockProduct]);
      prismaService.product.count.mockResolvedValue(1);

      await service.findAll(filterDto);

      expect(prismaService.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [
              { name: { contains: 'Nike' } },
              { description: { contains: 'Nike' } },
            ],
          }),
        }),
      );
    });

    it('should filter by size', async () => {
      const filterDto: ProductFilterDto = { size: '10' };
      prismaService.product.findMany.mockResolvedValue([mockProduct]);
      prismaService.product.count.mockResolvedValue(1);

      await service.findAll(filterDto);

      expect(prismaService.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            sizes: {
              some: {
                size: '10',
                inStock: true,
              },
            },
          }),
        }),
      );
    });

    it('should filter by color', async () => {
      const filterDto: ProductFilterDto = { color: 'Black' };
      prismaService.product.findMany.mockResolvedValue([mockProduct]);
      prismaService.product.count.mockResolvedValue(1);

      await service.findAll(filterDto);

      expect(prismaService.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            colors: {
              some: {
                name: { contains: 'Black' },
              },
            },
          }),
        }),
      );
    });

    it('should handle pagination', async () => {
      const filterDto: ProductFilterDto = { skip: 10, take: 5 };
      prismaService.product.findMany.mockResolvedValue([mockProduct]);
      prismaService.product.count.mockResolvedValue(15);

      const result = await service.findAll(filterDto);

      expect(prismaService.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 5,
        }),
      );
      expect(result.skip).toBe(10);
      expect(result.take).toBe(5);
    });

    it('should combine multiple filters', async () => {
      const filterDto: ProductFilterDto = {
        category: "Men's Shoes",
        gender: 'Men',
        minPrice: 100,
        maxPrice: 150,
        search: 'Nike',
      };
      prismaService.product.findMany.mockResolvedValue([mockProduct]);
      prismaService.product.count.mockResolvedValue(1);

      await service.findAll(filterDto);

      expect(prismaService.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            category: { contains: "Men's Shoes" },
            gender: { equals: 'Men' },
            price: {
              gte: 100,
              lte: 150,
            },
            OR: [
              { name: { contains: 'Nike' } },
              { description: { contains: 'Nike' } },
            ],
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a single product with all relations', async () => {
      const productId = 'product-id-123';
      const mockProductWithRelations = {
        ...mockProduct,
        images: [{ id: 'img-1', url: '/image.jpg' }],
        colors: [{ id: 'color-1', name: 'Black' }],
        sizes: [{ id: 'size-1', size: '10' }],
        details: [{ id: 'detail-1', key: 'Material', value: 'Leather' }],
        reviews: [],
      };

      prismaService.product.findUnique.mockResolvedValue(
        mockProductWithRelations,
      );

      const result = await service.findOne(productId);

      expect(prismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: productId },
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
      expect(result).toEqual(mockProductWithRelations);
    });
  });

  describe('getRecommendations', () => {
    it('should return up to 4 random products excluding the given product', async () => {
      const productId = 'product-id-123';
      const mockProducts = [mockProduct, mockProduct, mockProduct, mockProduct];

      prismaService.product.count.mockResolvedValue(10);
      prismaService.product.findMany.mockResolvedValue(mockProducts);

      const result = await service.getRecommendations(productId);

      expect(prismaService.product.count).toHaveBeenCalled();
      expect(prismaService.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            id: { not: productId },
          },
          take: 4,
          include: {
            images: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        }),
      );
      expect(result).toEqual(mockProducts);
      expect(result.length).toBeLessThanOrEqual(4);
    });

    it('should handle when there are fewer than 4 products', async () => {
      const productId = 'product-id-123';
      const mockProducts = [mockProduct];

      prismaService.product.count.mockResolvedValue(2);
      prismaService.product.findMany.mockResolvedValue(mockProducts);

      const result = await service.getRecommendations(productId);

      expect(result.length).toBeLessThanOrEqual(4);
    });
  });
});

