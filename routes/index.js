var express = require('express');
var router = express.Router();


//kết nối mongdb
const mongodb = 'mongodb+srv://hungnvph49297:hung2k54@hungnvph49297.tnyqa.mongodb.net/?retryWrites=true&w=majority&appName=hungnvph49297'
const mongoose = require('mongoose')
mongoose.connect(mongodb, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
  console.log("Connected to MongoDB")
}).catch(err => {
  console.log(err)
})


// Định nghĩa schema cho Ô Tô
const carSchema = new mongoose.Schema({
  MaXe: String,
  Name: String,
  Price: Number,
  Year: Number,
  Brand: String
});
const Car = mongoose.model('Car', carSchema);

// Xử lý form submit
router.post('/submit', function(req, res, next) {
  const { MaXe, Name, Price, Year, Brand } = req.body;

  // Kiểm tra validate trên server
  let errors = {};

  // Kiểm tra Mã Xe không trống
  if (!MaXe) errors.MaXe = 'Mã xe không được để trống!';

  // Kiểm tra Tên Xe phải là chữ
  const nameRegex = /^[A-Za-z\s]+$/;
  if (!nameRegex.test(Name)) errors.Name = 'Tên xe phải là chữ!';

  // Kiểm tra Giá Xe phải là số và lớn hơn 0
  if (isNaN(Price) || Price <= 0) errors.Price = 'Giá xe phải là số và lớn hơn 0!';

  // Kiểm tra Năm Sản Xuất hợp lệ
  if (isNaN(Year) || Year < 1980 || Year > 2024) errors.Year = 'Năm sản xuất phải từ 1980 đến 2024!';

  // Kiểm tra Thương Hiệu không trống
  if (!Brand) errors.Brand = 'Thương hiệu không được để trống!';

  // Nếu có lỗi, trả về lỗi
  if (Object.keys(errors).length > 0) {
    return res.render('index', { errors, MaXe, Name, Price, Year, Brand });
  }

  // Nếu không có lỗi, lưu vào MongoDB
  const newCar = new Car({ MaXe, Name, Price, Year, Brand });
  newCar.save()
      .then(() => res.send('Thêm Ô Tô thành công!'))
      .catch(err => res.status(500).send('Lỗi khi lưu Ô Tô.'));
});


// Xử lý GET để lấy danh sách Ô Tô
router.get('/cars', function(req, res, next) {
  Car.find()  // Lấy tất cả các xe trong CSDL
      .then(cars => {
        res.json(cars);  // Trả về dữ liệu dưới dạng JSON
      })
      .catch(err => {
        res.status(500).json({ error: 'Lỗi khi lấy danh sách Ô Tô.' });
      });
});



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
