import Product from "../../models/product.js"

export const getProductsByCategoryId = async (req, reply) => {
    const { categoryId } = req.params;
    try {
        const products = await Product.find({ category: categoryId })
            .select("-category") // fetch the product with complete details except category
            .exec();
        return reply.send(products);
    } catch (error) {
        return reply.status(500).send({ message: "An error occured" });
    }
}