# Kế hoạch Nâng Cấp Hệ Thống Xe Hơi & Tòa Nhà Đô Thị Xung Quanh (3D Modern City & Traffic)

## 1. Mục tiêu & Phân tích Yêu cầu
Người dùng yêu cầu tìm và thay thế mô hình mới cho các xe hơi và tòa nhà xung quanh nhà hàng, cho phép tìm nguồn ngoài và kết hợp mô hình 3D tối ưu hóa cao:
* **Hệ thống phương tiện (Vehicles)**:
  - Xe di chuyển hai chiều trên lòng đường (Eastbound & Westbound) với hiệu ứng quay bánh xe chân thực.
  - Xe ô tô và xe bán tải đậu lề đường (curbside parking) trước các khu phức hợp và tòa nhà đối diện.
  - Các loại xe đa dạng, low-poly stylized cao cấp: Xe sedan công sở, xe hatchback điện, xe bán tải tiếp tế nguyên liệu, xe taxi công nghệ, và xe máy giao hàng.
* **Kiến trúc đô thị xung quanh (Buildings)**:
  - Tòa nhà phong cách đô thị hiện đại: Mặt đứng kính phân tầng, mái che sảnh đón (canopy), mái hiên bạt thời thượng.
  - Biển hiệu đèn LED neon phát sáng rực rỡ: Đèn neon quán xá, biển hiệu kỹ thuật số billboard phát sáng mạnh vào ban đêm, tăng chiều sâu và độ sống động cho thành phố.
  - Chi tiết kiến trúc mái (rooftop): Điều hòa HVAC công nghiệp, pin mặt trời, lan can kính, ăng-ten truyền thông.
* **Quy tắc Kiến trúc & Ràng buộc Hard Limit**:
  - Tuân thủ nghiêm ngặt **giới hạn dưới 500 LOC/file**.
  - Tách module độc lập có trách nhiệm rõ ràng: `src/scene/cityVehicles.ts` và `src/scene/cityBuildings.ts`.
  - Giảm tải cho `cityEnvironmentMeshes.ts` và giữ `CityScene3D.ts` an toàn dưới 420 dòng.

---

## 2. Thiết kế Kiến trúc Module

```
src/scene/
├── cityVehicles.ts         [MỚI] ~220 dòng - Model xe hơi chất lượng cao + CityTrafficManager (xe chạy & xe đậu)
├── cityBuildings.ts        [MỚI] ~260 dòng - Model tòa nhà hiện đại, mái che sảnh đón, biển hiệu LED neon
├── cityEnvironmentMeshes.ts [REFACTOR] ~120 dòng - Phối hợp cây xanh, mặt đường, vỉa hè, tích hợp 2 module trên
└── CityScene3D.ts          [UPDATE] ~410 dòng - Gọi trafficManager.update(deltaSec) cập nhật chuyển động xe
```

---

## 3. Chi tiết Triển khai

### Phase 1: Hệ Thống Xe Cộ Đa Dạng & Quản Lý Giao Thông (`src/scene/cityVehicles.ts`)
* **Tạo Model Phương Tiện Chi Tiết**:
  - **Modern Sedan**: Khung xe bóng bẩy, kính chắn gió uốn lượn, đèn pha LED trước, đèn hậu đỏ, gương chiếu hậu và mâm đúc hợp kim.
  - **Electric Hatchback**: Xe điện đô thị gọn gàng với nóc kính toàn cảnh (panoramic roof), màu sơn phong cách pastel/neon.
  - **Urban Supply Pickup/Van**: Xe bán tải thùng hàng tiếp tế cho các cửa hàng đối diện, có decal sọc thể thao.
  - **Curbside Parked Cars**: Xe đậu góc nghiêng hoặc dọc lề đường có đèn xi-nhan/phản quang.
* **CityTrafficManager**:
  - Quản lý mảng xe chuyển động trên 2 làn đường:
    - Làn 1 (Z = 6.6): Chiều xe chạy từ Tây sang Đông (`x` tăng dần, khi vượt quá +34m sẽ reset về -34m với màu sắc/loại xe ngẫu nhiên).
    - Làn 2 (Z = 9.4): Chiều xe chạy từ Đông sang Tây (`x` giảm dần, khi vượt quá -34m sẽ reset về +34m).
  - Tự động xoay bánh xe theo vận tốc di chuyển (`wheel.rotation.z += speed * dt`).
  - Hỗ trợ tương tác nhấp chọn xem thông tin phương tiện đô thị bằng tiếng Việt.

### Phase 2: Hệ Thống Tòa Nhà Đô Thị Hiện Đại & Biển Hiệu LED Neon (`src/scene/cityBuildings.ts`)
* **Mặt đứng kiến trúc cao cấp**:
  - **Tòa Tháp Tài Chính & Công Nghệ (Metro FinTech Tower)**:
    - Khối tháp kính xanh đa tầng với khung kim loại hiện đại.
    - Sảnh tầng trệt có mái che đón khách (Glass Canopy) với cột đỡ mạ chrome.
    - Màn hình LED kỹ thuật số cỡ lớn hiển thị logo công nghệ phát sáng rực rỡ.
    - Hệ thống đèn hắt kiến trúc (LED strips) chạy dọc gờ tường.
  - **Khu Phức Hợp Căn Hộ Đô Thị (Metropolitan Luxury Residence)**:
    - Ban công kính cường lực, lam chắn nắng hiện đại, cây xanh trang trí trên ban công tầng lửng.
    - Biển hiệu đèn neon chữ nổi phát sáng vào ban đêm.
  - **Siêu Thị & Trung Tâm Mua Sắm (Central Gourmet Mart)**:
    - Mái đón vòm hiện đại, cửa kính lớn nhìn vào khu thương mại.
    - Biển hiệu LED màu vàng cam nổi bật.
  - **Quán Đối Thủ Cạnh Tranh (Artisan Roastery Bistro)**:
    - Mặt tiền ốp gỗ và bê tông mài, mái hiên bạt sọc phong cách châu Âu, bàn ghế cà phê vỉa hè.
* **Hiệu ứng Ngày/Đêm**:
  - Biển hiệu LED và cửa sổ phát sáng tăng cường độ (`emissiveIntensity`) khi trời về chiều tối/đêm.

### Phase 3: Tích hợp vào Môi trường & Khung cảnh 3D (`cityEnvironmentMeshes.ts` & `CityScene3D.ts`)
* Tinh gọn `cityEnvironmentMeshes.ts`: Bỏ phần code tạm của tòa nhà cũ và xe máy đơn lẻ, ủy quyền hoàn toàn cho `cityBuildings.ts` và `cityVehicles.ts`.
* Kết nối vòng lặp hoạt ảnh xe chạy trong `CityScene3D.ts` thông qua `trafficManager.update(deltaSec)`.
* Đảm bảo nhấp chuột vào xe cộ hoặc tòa nhà hiển thị đúng bảng thông tin chi tiết tiếng Việt.

### Phase 4: Kiểm tra & Nghiệm thu Kỹ thuật
* Kiểm tra `lint_applet` và `compile_applet`.
* Đếm dòng lệnh toàn bộ các file (`wc -l`) để đảm bảo tuyệt đối không có file nào vượt quá 500 dòng code.
* Khởi động lại dev server và xác nhận khung cảnh 3D hoạt động mượt mà, chân thực.
