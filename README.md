# lengkeng-test

Playwright test suite for testing the login functionality of http://lengkeng-dev.hocai.fun/

## Thông tin đăng nhập (Login Credentials)
- **Username:** admin  
- **Password:** passwd

## Cài đặt (Installation)

1. Clone repository:
```bash
git clone https://github.com/fanhuang-hn/lengkeng-test.git
cd lengkeng-test
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Cài đặt Playwright browsers:
```bash
npm run install-browsers
```

## Chạy tests (Running Tests)

### Các lệnh test chính:

```bash
# Chạy tất cả tests (headless mode)
npm test

# Chạy tests với browser hiển thị
npm run test:headed

# Chạy tests trong debug mode
npm run test:debug  

# Chạy tests với UI mode (interactive)
npm run test:ui

# Xem báo cáo test results
npm run test:report
```

### Chạy tests cụ thể:

```bash
# Chỉ chạy login tests
npx playwright test login

# Chạy test với browser cụ thể
npx playwright test --project=chromium

# Chạy với nhiều workers
npx playwright test --workers=1
```

## Test Coverage

Test suite bao gồm các test cases sau:

### ✅ Successful Login Test
- Điều hướng đến trang login  
- Nhập username: `admin`
- Nhập password: `passwd`
- Submit form
- Verify successful login (URL change, dashboard elements, user indicators)
- Chụp screenshot tại các bước quan trọng

### ❌ Failed Login Test  
- Test với credentials không hợp lệ
- Verify error messages hiển thị
- Verify user vẫn ở trang login

### 📝 Form Validation Test
- Submit form trống
- Check validation messages
- Verify form không submit được khi thiếu thông tin

### 🔍 Accessibility & Structure Test
- Check page title
- Verify page content
- Take screenshots cho visual verification
- Log page information

## Cấu trúc Project

```
lengkeng-test/
├── tests/
│   └── login.spec.js       # Main login test suite
├── test-results/           # Screenshots và artifacts
├── playwright-report/      # HTML test reports  
├── playwright.config.js    # Playwright configuration
├── package.json           # Project dependencies và scripts
└── README.md             # Documentation này
```

## Screenshots

Test sẽ tự động chụp screenshots tại các thời điểm:
- `01-initial-page.png` - Trang ban đầu
- `02-form-filled.png` - Sau khi điền form
- `03-after-login.png` - Sau khi login  
- `04-invalid-login.png` - Khi login sai
- `05-empty-form-validation.png` - Validation form trống
- `06-accessibility-check.png` - Accessibility check

## Configuration

### Playwright Config Features:
- ✅ Base URL: `http://lengkeng-dev.hocai.fun`
- ✅ Multiple browser support (Chrome, Firefox, Safari)
- ✅ Screenshot on failure
- ✅ Video recording on failure
- ✅ Trace collection on retry
- ✅ HTML reporter
- ✅ Parallel test execution

### Browser Support:
- 🌐 Chromium (Desktop Chrome)
- 🦊 Firefox  
- 🧭 WebKit (Safari)

## Troubleshooting

### Nếu browsers chưa được cài đặt:
```bash
npx playwright install chromium firefox webkit
```

### Nếu test failed do network issues:
- Check VPN connection
- Verify http://lengkeng-dev.hocai.fun/ có thể access được
- Run với `--timeout 60000` để tăng timeout

### Debug tests:
```bash
# Run với debug mode
npm run test:debug

# Hoặc chạy specific test với debug
npx playwright test login --debug
```

### Xem detailed logs:
```bash
# Run với verbose logging
DEBUG=pw:api npx playwright test
```

## Contributing

1. Tạo test cases mới trong `tests/` directory
2. Follow naming convention: `*.spec.js`
3. Include appropriate assertions và error handling
4. Add screenshots cho important steps
5. Update README nếu có thay đổi configuration

## Notes

- Tests được design để robust với multiple selector strategies
- Auto-retry mechanisms cho network calls
- Comprehensive error handling
- Visual verification thông qua screenshots
- Support cả Vietnamese và English text indicators