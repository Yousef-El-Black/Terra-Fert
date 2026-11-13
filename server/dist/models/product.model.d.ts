import mongoose = require("mongoose");
declare const Product: mongoose.Model<{
    images: string[];
    title: string;
    category: string;
    status: "متوفر" | "غير متوفر";
    description: string;
    unit: string;
    rating: mongoose.Types.DocumentArray<{
        name: string;
        comment: string;
        rate: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        name: string;
        comment: string;
        rate: number;
    }, {}, {}> & {
        name: string;
        comment: string;
        rate: number;
    }>;
}, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    images: string[];
    title: string;
    category: string;
    status: "متوفر" | "غير متوفر";
    description: string;
    unit: string;
    rating: mongoose.Types.DocumentArray<{
        name: string;
        comment: string;
        rate: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        name: string;
        comment: string;
        rate: number;
    }, {}, {}> & {
        name: string;
        comment: string;
        rate: number;
    }>;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    images: string[];
    title: string;
    category: string;
    status: "متوفر" | "غير متوفر";
    description: string;
    unit: string;
    rating: mongoose.Types.DocumentArray<{
        name: string;
        comment: string;
        rate: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        name: string;
        comment: string;
        rate: number;
    }, {}, {}> & {
        name: string;
        comment: string;
        rate: number;
    }>;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    images: string[];
    title: string;
    category: string;
    status: "متوفر" | "غير متوفر";
    description: string;
    unit: string;
    rating: mongoose.Types.DocumentArray<{
        name: string;
        comment: string;
        rate: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        name: string;
        comment: string;
        rate: number;
    }, {}, {}> & {
        name: string;
        comment: string;
        rate: number;
    }>;
}, mongoose.Document<unknown, {}, {
    images: string[];
    title: string;
    category: string;
    status: "متوفر" | "غير متوفر";
    description: string;
    unit: string;
    rating: mongoose.Types.DocumentArray<{
        name: string;
        comment: string;
        rate: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        name: string;
        comment: string;
        rate: number;
    }, {}, {}> & {
        name: string;
        comment: string;
        rate: number;
    }>;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    images: string[];
    title: string;
    category: string;
    status: "متوفر" | "غير متوفر";
    description: string;
    unit: string;
    rating: mongoose.Types.DocumentArray<{
        name: string;
        comment: string;
        rate: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        name: string;
        comment: string;
        rate: number;
    }, {}, {}> & {
        name: string;
        comment: string;
        rate: number;
    }>;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & mongoose.HydratedDocumentOverrides<{
    id: string;
}>, unknown, {
    images: string[];
    title: string;
    category: string;
    status: "متوفر" | "غير متوفر";
    description: string;
    unit: string;
    rating: mongoose.Types.DocumentArray<{
        name: string;
        comment: string;
        rate: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        name: string;
        comment: string;
        rate: number;
    }, {}, {}> & {
        name: string;
        comment: string;
        rate: number;
    }>;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    images: string[];
    title: string;
    category: string;
    status: "متوفر" | "غير متوفر";
    description: string;
    unit: string;
    rating: mongoose.Types.DocumentArray<{
        name: string;
        comment: string;
        rate: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        name: string;
        comment: string;
        rate: number;
    }, {}, {}> & {
        name: string;
        comment: string;
        rate: number;
    }>;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & Required<{
    _id: mongoose.Types.ObjectId;
}>>;
export = Product;
//# sourceMappingURL=product.model.d.ts.map