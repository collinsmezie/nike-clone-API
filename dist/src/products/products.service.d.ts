import { PrismaService } from '../prisma.service';
import { ProductFilterDto } from './dto/product-filter.dto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(filterDto: ProductFilterDto): Promise<{
        products: ({
            colors: {
                id: string;
                name: string;
                hexCode: string | null;
                imageUrl: string;
                productId: string;
            }[];
            images: {
                url: string;
                id: string;
                isPrimary: boolean;
                productId: string;
            }[];
            sizes: {
                id: string;
                size: string;
                inStock: boolean;
                productId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            category: string;
            price: number;
            description: string;
            rating: number;
            reviewCount: number;
            style: string;
            badge: string | null;
            gender: string | null;
            sport: string | null;
            shoeHeight: string | null;
            isHighlyRated: boolean;
        })[];
        total: number;
        skip: number;
        take: number;
    }>;
    findOne(id: string): Promise<({
        reviews: ({
            user: {
                fullName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            rating: number;
            comment: string;
            userId: string;
            productId: string;
        })[];
        colors: {
            id: string;
            name: string;
            hexCode: string | null;
            imageUrl: string;
            productId: string;
        }[];
        images: {
            url: string;
            id: string;
            isPrimary: boolean;
            productId: string;
        }[];
        sizes: {
            id: string;
            size: string;
            inStock: boolean;
            productId: string;
        }[];
        details: {
            id: string;
            key: string;
            value: string;
            productId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        category: string;
        price: number;
        description: string;
        rating: number;
        reviewCount: number;
        style: string;
        badge: string | null;
        gender: string | null;
        sport: string | null;
        shoeHeight: string | null;
        isHighlyRated: boolean;
    }) | null>;
    getRecommendations(productId: string): Promise<({
        images: {
            url: string;
            id: string;
            isPrimary: boolean;
            productId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        category: string;
        price: number;
        description: string;
        rating: number;
        reviewCount: number;
        style: string;
        badge: string | null;
        gender: string | null;
        sport: string | null;
        shoeHeight: string | null;
        isHighlyRated: boolean;
    })[]>;
}
