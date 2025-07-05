import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Đọc file JSON
const enPath = path.join(__dirname, 'src/locales/en.json');
const viPath = path.join(__dirname, 'src/locales/vi.json');

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const viData = JSON.parse(fs.readFileSync(viPath, 'utf8'));

// Hàm lấy tất cả key từ object nested
function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        keys = keys.concat(getAllKeys(obj[key], fullKey));
      } else {
        keys.push(fullKey);
      }
    }
  }
  return keys;
}

// Lấy tất cả key từ cả hai file
const enKeys = getAllKeys(enData);
const viKeys = getAllKeys(viData);

// Tìm key thiếu
const missingInVi = enKeys.filter((key) => !viKeys.includes(key));
const missingInEn = viKeys.filter((key) => !enKeys.includes(key));

console.log('=== KIỂM TRA I18N KEYS ===\n');

console.log(`Tổng số key trong en.json: ${enKeys.length}`);
console.log(`Tổng số key trong vi.json: ${viKeys.length}\n`);

if (missingInVi.length > 0) {
  console.log('❌ Keys thiếu trong vi.json:');
  missingInVi.forEach((key) => console.log(`  - ${key}`));
  console.log('');
}

if (missingInEn.length > 0) {
  console.log('❌ Keys thiếu trong en.json:');
  missingInEn.forEach((key) => console.log(`  - ${key}`));
  console.log('');
}

if (missingInVi.length === 0 && missingInEn.length === 0) {
  console.log('✅ Tất cả keys đều đồng bộ giữa en.json và vi.json!');
} else {
  console.log(`⚠️  Có ${missingInVi.length + missingInEn.length} key(s) không đồng bộ`);
}
