import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import * as dotenv from 'dotenv';

dotenv.config();

const adapter = new PrismaLibSql({
    url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
});
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Seeding database...');

    // Clear existing data
    console.log('Clearing existing data...');
    await prisma.review.deleteMany({});
    await prisma.productDetail.deleteMany({});
    await prisma.productSize.deleteMany({});
    await prisma.productColor.deleteMany({});
    await prisma.productImage.deleteMany({});
    await prisma.product.deleteMany({});

    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await prisma.user.upsert({
        where: { email: 'test@nike.com' },
        update: {},
        create: {
            email: 'test@nike.com',
            password: hashedPassword,
            fullName: 'Test User',
        },
    });

    console.log('Created test user:', user.email);

    // Define the 12 products from the design
    const products = [
        {
            name: "Nike Air Force 1 Mid '07",
            category: "Men's Shoes",
            price: 110.00,
            image: '/products/product1.png',
            colors: 6,
            badge: 'Just In',
            gender: 'Men',
            sport: 'Lifestyle',
            shoeHeight: 'Mid Top',
        },
        {
            name: "Nike Court Vision Low Next Nature",
            category: "Women's Shoes",
            price: 75.00,
            image: '/products/product2.png',
            colors: 4,
            badge: 'Sustainable Materials',
            gender: 'Women',
            sport: 'Lifestyle',
            shoeHeight: 'Low Top',
        },
        {
            name: "Nike Air Force 1 PLT.AF.ORM",
            category: "Women's Shoes",
            price: 105.00,
            image: '/products/product3.png',
            colors: 1,
            badge: 'Extra 20% off',
            gender: 'Women',
            sport: 'Lifestyle',
            shoeHeight: 'Low Top',
        },
        {
            name: "Nike Dunk Low Retro",
            category: "Men's Shoes",
            price: 115.00,
            image: '/products/product4.png',
            colors: 6,
            badge: 'Just In',
            gender: 'Men',
            sport: 'Basketball',
            shoeHeight: 'Low Top',
        },
        {
            name: "Nike Air Max SYSTM",
            category: "Kids' Shoes",
            price: 85.00,
            image: '/products/product5.png',
            colors: 4,
            badge: 'Best Seller',
            gender: 'Kids',
            sport: 'Lifestyle',
            shoeHeight: 'Low Top',
        },
        {
            name: "Nike Air Force 1 PLT.AF.ORM LV8",
            category: "Women's Shoes",
            price: 120.00,
            image: '/products/product6.png',
            colors: 1,
            badge: 'Sustainable Materials',
            gender: 'Women',
            sport: 'Lifestyle',
            shoeHeight: 'Low Top',
        },
        {
            name: "Nike Dunk Low Retro SE",
            category: "Men's Shoes",
            price: 125.00,
            image: '/products/product7.png',
            colors: 6,
            badge: 'Extra 20% off',
            gender: 'Men',
            sport: 'Basketball',
            shoeHeight: 'Low Top',
        },
        {
            name: "Nike Air Max 90 SE",
            category: "Men's Shoes",
            price: 130.00,
            image: '/products/product8.png',
            colors: 1,
            badge: 'Just In',
            gender: 'Men',
            sport: 'Running',
            shoeHeight: 'Low Top',
        },
        {
            name: "Nike Legend Essential 3 Next Nature",
            category: "Men's Training Shoes",
            price: 65.00,
            image: '/products/product9.png',
            colors: 4,
            badge: 'Best Seller',
            gender: 'Men',
            sport: 'Training',
            shoeHeight: 'Low Top',
        },
        {
            name: "Nike SB Zoom Janoski OG+",
            category: "Unisex Shoes",
            price: 95.00,
            image: '/products/product10.png',
            colors: 6,
            badge: 'Sustainable Materials',
            gender: 'Unisex',
            sport: 'Skateboarding',
            shoeHeight: 'Low Top',
        },
        {
            name: "Jordan Series ES",
            category: "Men's Shoes",
            price: 85.00,
            image: '/products/product11.png',
            colors: 4,
            badge: 'Extra 20% off',
            gender: 'Men',
            sport: 'Jordan',
            shoeHeight: 'Low Top',
        },
        {
            name: "Nike Blazer Low '77 Jumbo",
            category: "Women's Shoes",
            price: 100.00,
            image: '/products/product12.png',
            colors: 1,
            badge: 'Just In',
            gender: 'Women',
            sport: 'Lifestyle',
            shoeHeight: 'Low Top',
        },
        {
            name: "Nike Air Max 90 Future",
            category: "Women's Shoes",
            price: 140.00,
            image: '/products/product13.jpg',
            colors: 6,
            badge: 'New Arrival',
            gender: 'Women',
            sport: 'Running',
            shoeHeight: 'Low Top',
        }
    ];

    for (const product of products) {
        const { image, colors: colorCount, ...productData } = product as any;
        const isProduct13 = image.includes('product13');

        let productImages: { url: string; isPrimary: boolean }[] = [];
        let productColors: { name: string; hexCode: string; imageUrl: string }[] = [];

        if (isProduct13) {
            // Product 13 specific images (Main + Angles 14-20)
            productImages = [
                { url: image, isPrimary: true },
                { url: '/products/product14.png', isPrimary: false },
                { url: '/products/product15.png', isPrimary: false },
                { url: '/products/product16.png', isPrimary: false },
                { url: '/products/product17.png', isPrimary: false },
                { url: '/products/product18.png', isPrimary: false },
                { url: '/products/product19.png', isPrimary: false },
                { url: '/products/product20.png', isPrimary: false },
            ];

            // Product 13 specific colors (Variants 21-26)
            const variantImages = [
                '/products/product21.png',
                '/products/product22.png',
                '/products/product23.png',
                '/products/product24.png',
                '/products/product25.png',
                '/products/product26.png',
            ];

            const baseColors = [
                { name: 'Variant 1', hex: '#ffffff' },
                { name: 'Variant 2', hex: '#000000' },
                { name: 'Variant 3', hex: '#DC143C' },
                { name: 'Variant 4', hex: '#4169E1' },
                { name: 'Variant 5', hex: '#01796F' },
                { name: 'Variant 6', hex: '#7D7F7D' }
            ];

            productColors = variantImages.map((img, index) => ({
                name: baseColors[index]?.name || `Variant ${index + 1}`,
                hexCode: baseColors[index]?.hex || '#cccccc',
                imageUrl: img
            }));

        } else {
            // Standard logic for other products: ONLY 1 image and 1 color
            productImages = [
                { url: image, isPrimary: true },
            ];

            // Only 1 color variant (the main one)
            productColors = [{
                name: 'Standard',
                hexCode: '#000000',
                imageUrl: image
            }];
        }

        await prisma.product.create({
            data: {
                ...productData,
                description: `Experience the perfect blend of style and comfort with the ${productData.name}. Designed for everyday wear, it features premium materials and iconic Nike cushioning.`,
                rating: 4.5 + (Math.random() * 0.5),
                reviewCount: Math.floor(Math.random() * 100) + 10,
                style: `NK-${Math.random().toString(36).substring(7).toUpperCase()}`,
                isHighlyRated: Math.random() > 0.5,
                images: {
                    create: productImages,
                },
                colors: {
                    create: productColors
                },
                sizes: {
                    create: [
                        { size: '7', inStock: true },
                        { size: '7.5', inStock: true },
                        { size: '8', inStock: true },
                        { size: '8.5', inStock: true },
                        { size: '9', inStock: true },
                        { size: '9.5', inStock: true },
                        { size: '10', inStock: true },
                        { size: '10.5', inStock: true },
                        { size: '11', inStock: true },
                        { size: '11.5', inStock: false },
                        { size: '12', inStock: true },
                    ],
                },
                details: {
                    create: [
                        { key: 'Feature', value: 'Premium materials' },
                        { key: 'Feature', value: 'Durable construction' },
                        { key: 'Comfort', value: 'Cushioned midsole' },
                    ],
                },
                reviews: {
                    create: [
                        {
                            userId: user.id,
                            rating: 5,
                            comment: 'Absolutely love these! Great fit and look amazing.',
                        },
                        {
                            userId: user.id,
                            rating: 4,
                            comment: 'Good shoes, but run slightly small.',
                        },
                    ],
                },
            },
        });
    }

    console.log('Database seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
