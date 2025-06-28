export type ProductImage = {
  url: string;
  publicId?: string;
  isDefault: boolean;
};

export type AttributeValue = {
  label: string;
  value: string;
};

export type ProductAttribute = {
  name: string;
  values: AttributeValue[];
};

export type VariantAttributeValue = {
  attributeName: string;
  attributeValueLabel: string;
};

export type ProductVariant = {
  sku: string;
  price: number;
  salePrice?: number;
  stock: number;
  attributeValues: VariantAttributeValue[];
  images: ProductImage[];
};

export type Product = {
  id?: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  salePrice?: number;
  costPrice?: number;
  stock: number;
  categoryId: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  isPublished: boolean;
  images: ProductImage[];
  attributes: ProductAttribute[];
  variants: ProductVariant[];
};

export type ProductPayload = {
  name: string;
  sku: string;
  description: string;
  price: number;
  salePrice?: number;
  costPrice?: number;
  stock: number;
  categoryId: string;
  status: string;
  isPublished: boolean;
  images: Array<{
    url: string;
    publicId?: string;
    isDefault?: boolean;
  }>;
  attributes?: Array<{
    name: string;
    values: Array<{
      label: string;
      value: string;
    }>;
  }>;
  variants?: Array<{
    sku: string;
    price: number;
    salePrice?: number;
    stock: number;
    attributeValues: Array<{
      attributeName: string;
      attributeValueLabel: string;
    }>;
    images: Array<{
      url: string;
      publicId?: string;
      isDefault?: boolean;
    }>;
  }>;
};

export type ProductDetailResponse = {
  id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  salePrice?: number;
  costPrice?: number;
  stock: number;
  isNew?: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  isPublished: boolean;
  defaultImageUrl?: string;
  averageRating?: number;
  reviewCount?: number;
  searchKeywords?: string;
  createdAt: string;
  updatedAt: string;

  // Related entities
  seller?: {
    shopName: string;
  };
  category?: {
    id: string;
    name: string;
    slug?: string;
  };

  // This field is needed for form population
  categoryId: string;

  // Collections
  images: Array<{
    id?: string;
    url: string;
    publicId?: string;
    isDefault: boolean;
  }>;
  attributes: Array<{
    id: string;
    name: string;
    values: Array<{
      id: string;
      label: string;
      value: string;
    }>;
  }>;
  variants: Array<{
    id: string;
    sku: string;
    price: number;
    salePrice?: number;
    stock: number;
    attributes: Array<{
      attributeId?: string;
      attributeName: string;
      valueId?: string;
      attributeValueLabel: string;
      attributeValue?: string;
    }>;
    images: Array<{
      url: string;
      publicId?: string;
      isDefault: boolean;
    }>;
  }>;

  // Additional metadata
  hasVariants: boolean;
  variantCount: number;
  attributeCount: number;
  imageCount: number;
};

export type ProductResponse = {
  id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  salePrice?: number;
  stock: number;
  categoryId: string;
  categoryName?: string;
  sellerId: string;
  sellerShopName?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  isPublished: boolean;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
};

export type ProductListResponse = {
  content: ProductResponse[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
};
