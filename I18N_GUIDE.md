# Hướng dẫn sử dụng i18n (Internationalization)

## Tổng quan

Dự án đã được cấu hình sẵn hệ thống đa ngôn ngữ với **tiếng Anh** (mặc định) và **tiếng Việt**.

## Cấu hình hiện tại

### 1. Ngôn ngữ hỗ trợ

- **Tiếng Anh (en)**: Ngôn ngữ mặc định
- **Tiếng Việt (vi)**: Ngôn ngữ phụ

### 2. Cấu trúc file

```
src/
├── locales/
│   ├── en.json          # Tiếng Anh
│   └── vi.json          # Tiếng Việt
├── libs/
│   └── i18n.lib.ts      # Cấu hình i18n
├── hooks/
│   └── use-translation.hook.ts  # Hook tùy chỉnh
├── constants/
│   └── languages.const.ts       # Danh sách ngôn ngữ
└── components/
    └── common/
        └── language-switcher.tsx  # Component chuyển ngôn ngữ
```

## Cách sử dụng

### 1. Sử dụng hook useTranslation

```typescript
import { useTranslation } from '~/hooks';

const MyComponent = () => {
  const { t, changeLanguage, getCurrentLanguage } = useTranslation();

  return (
    <div>
      <h1>{t('Common.welcome')}</h1>
      <p>{t('Common.description')}</p>
      <button onClick={() => changeLanguage('vi')}>
        Tiếng Việt
      </button>
    </div>
  );
};
```

### 2. Sử dụng component LanguageSwitcher

```typescript
import { LanguageSwitcher } from '~/components/common';

const Header = () => {
  return (
    <header>
      <nav>
        {/* Menu items */}
      </nav>
      <LanguageSwitcher />
    </header>
  );
};
```

### 3. Các tùy chọn của LanguageSwitcher

```typescript
<LanguageSwitcher
  variant="outline"     // 'default' | 'outline' | 'ghost'
  size="sm"             // 'default' | 'sm' | 'lg' | 'icon'
  showIcon={true}       // Hiển thị icon
  showText={true}       // Hiển thị text
/>
```

## Cấu trúc JSON translation

### Nhóm chính:

- **Common**: Từ khóa chung (welcome, home, login, etc.)
- **Auth**: Xác thực (signIn, signUp, password, etc.)
- **Navigation**: Điều hướng (dashboard, products, orders, etc.)
- **Product**: Sản phẩm (product, price, category, etc.)
- **Order**: Đơn hàng (order, status, payment, etc.)
- **Cart**: Giỏ hàng (cart, checkout, quantity, etc.)
- **User**: Người dùng (customer, seller, profile, etc.)
- **Error**: Lỗi (error, warning, pageNotFound, etc.)
- **Date**: Ngày tháng (today, yesterday, ago, etc.)

### Ví dụ sử dụng:

```typescript
// Từ khóa đơn giản
t('Common.welcome'); // "Welcome" / "Chào mừng"
t('Product.addToCart'); // "Add to Cart" / "Thêm vào giỏ hàng"
t('Order.pending'); // "Pending" / "Chờ xác nhận"

// Với interpolation
t('Cart.cartItemsCount', { count: 5 }); // "5 items in cart" / "5 sản phẩm trong giỏ"
```

## Thêm ngôn ngữ mới

### 1. Thêm cấu hình ngôn ngữ

```typescript
// constants/languages.const.ts
{
  country: 'FR',
  locale: fr,
  currency: {
    locale: 'fr-FR',
    unit: 'EUR'
  },
  i18n: 'fr',
  isDefault: false,
  logo: '/images/common/languages/fr.svg',
  label: 'Français'
}
```

### 2. Tạo file JSON

```json
// locales/fr.json
{
  "Common": {
    "welcome": "Bienvenue",
    "home": "Accueil"
    // ...
  }
}
```

### 3. Cập nhật i18n config

```typescript
// libs/i18n.lib.ts
import frJSON from '~/locales/fr.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: { ...enJSON } },
    vi: { translation: { ...viJSON } },
    fr: { translation: { ...frJSON } }
  }
  // ...
});
```

## Thêm key translation mới

### 1. Thêm vào file JSON

```json
// locales/en.json
{
  "Product": {
    "newFeature": "New Feature",
    "newFeatureDescription": "This is a new feature"
  }
}
```

```json
// locales/vi.json
{
  "Product": {
    "newFeature": "Tính năng mới",
    "newFeatureDescription": "Đây là tính năng mới"
  }
}
```

### 2. Sử dụng trong component

```typescript
const { t } = useTranslation();

return (
  <div>
    <h3>{t('Product.newFeature')}</h3>
    <p>{t('Product.newFeatureDescription')}</p>
  </div>
);
```

## Best Practices

### 1. Nhóm keys theo feature

```json
{
  "ProductManagement": {
    "createProduct": "Create Product",
    "editProduct": "Edit Product",
    "deleteProduct": "Delete Product"
  }
}
```

### 2. Sử dụng nested keys

```json
{
  "Order": {
    "status": {
      "pending": "Pending",
      "confirmed": "Confirmed",
      "shipped": "Shipped"
    }
  }
}
```

### 3. Sử dụng pluralization

```json
{
  "Cart": {
    "itemCount": "{{count}} item",
    "itemCount_other": "{{count}} items"
  }
}
```

## Debugging

### 1. Kiểm tra key có tồn tại

```typescript
const { t } = useTranslation();

// Nếu key không tồn tại, sẽ trả về key đó
console.log(t('NonExistent.key')); // "NonExistent.key"
```

### 2. Kiểm tra ngôn ngữ hiện tại

```typescript
const { getCurrentLanguage } = useTranslation();

console.log(getCurrentLanguage()); // "en" hoặc "vi"
```

### 3. Fallback language

Nếu key không tồn tại trong ngôn ngữ hiện tại, hệ thống sẽ fallback về tiếng Anh.

## Lưu ý

1. **Performance**: Tất cả translations được load một lần khi app khởi động
2. **Persistence**: Ngôn ngữ được chọn sẽ được lưu trong localStorage
3. **Fallback**: Luôn có tiếng Anh làm fallback language
4. **Type Safety**: Sử dụng TypeScript để đảm bảo type safety
5. **Lazy Loading**: Có thể implement lazy loading cho các ngôn ngữ ít dùng

## Ví dụ thực tế

Xem file `src/components/examples/header-example.tsx` để có ví dụ chi tiết về cách sử dụng i18n trong component.
