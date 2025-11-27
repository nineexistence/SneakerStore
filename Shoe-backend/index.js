/* eslint-disable no-console */
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import cors from "cors";
import PDFDocument from "pdfkit";

const app = express();

/* ───────── MIDDLEWARE ───────── */
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PATCH",
    allowedHeaders: "Content-Type",
  })
);
app.use(express.urlencoded({ extended: true }));
app.use("/assets", express.static("assets"));

/* ───────── DATABASE ───────── */
mongoose
  .connect("mongodb://localhost:27017/shoestore")
  .then(() => console.log("✅ DB connected"))
  .catch((err) => console.log("❌ DB connection error:", err));

/* ───────── MODELS ───────── */
const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: String,
  blocked: { type: Boolean, default: false },
});
const User = mongoose.model("users", userSchema);

const productSchema = new mongoose.Schema({
  id: Number,
  title: String,
  category: String,
  price: Number,
  description: String,
  image: String,
});
const Product = mongoose.model("products", productSchema);

const orderSchema = new mongoose.Schema({
  customerInfo: Object,
  shippingAddress: Object,
  billingAddress: Object,
  items: Array,
  shippingMethod: String,
  paymentInfo: Object,
  promoCode: String,
  totals: Object,
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const Order = mongoose.model("orders", orderSchema);

/* ───────── AUTH ROUTES ───────── */
app.post("/signup", async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await new User({ email, username, password: hashedPassword }).save();
    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    res.status(200).json({
      message: "Login successful",
      token: "dummy-token",
      user: { email: user.email, username: user.username },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ───────── ORDER ROUTES ───────── */
app.post("/placeOrder", async (req, res) => {
  try {
    const newOrder = new Order({
      ...req.body,
      status: "Dispatched",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const savedOrder = await newOrder.save();
    res.status(201).json({
      message: "Order placed successfully",
      orderId: savedOrder._id,
      shippingAddress: savedOrder.shippingAddress,
      totalPrice: savedOrder.totals.total,
    });
  } catch (error) {
    console.error("❌ Error placing order:", error);
    res.status(500).json({ message: "Failed to place order" });
  }
});

app.get("/orders/user/:email", async (req, res) => {
  try {
    const userOrders = await Order.find({
      "customerInfo.email": req.params.email,
    });
    res.status(200).json(userOrders);
  } catch (error) {
    console.error("❌ Error fetching user orders:", error);
    res.status(500).json({ message: "Failed to retrieve orders" });
  }
});

/* ───────── ADMIN ROUTES ───────── */
app.get("/admin/stats", async (_, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const [ordersToday, totalProducts, customers] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: start, $lte: end } }),
      Product.countDocuments(),
      User.countDocuments(),
    ]);

    res.json({ ordersToday, totalProducts, customers, couponsActive: 0 });
  } catch (err) {
    console.error("❌ /admin/stats error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/admin/sales/weekly", async (_, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 6);

    const agg = await Order.aggregate([
      { $match: { createdAt: { $gte: weekAgo, $lte: new Date() } } },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          sales: { $sum: "$totals.total" },
        },
      },
    ]);

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const data = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekAgo);
      d.setDate(weekAgo.getDate() + i);
      const dow = d.getDay();
      const hit = agg.find((x) => x._id === dow + 1);
      return { name: days[dow], sales: hit ? hit.sales : 0 };
    });

    res.json(data);
  } catch (err) {
    console.error("❌ /admin/sales/weekly error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/admin/orders", async (_, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

app.get("/admin/orders/:id", async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Not found" });
  res.json(order);
});

app.patch("/admin/orders/:id/status", async (req, res) => {
  const { status } = req.body;
  const allowed = ["Pending", "Processing", "Shipped", "Delivered", "Refunded", "Cancelled"];
  if (!allowed.includes(status))
    return res.status(400).json({ message: "Invalid status" });

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status, updatedAt: new Date() },
    { new: true }
  );
  res.json(order);
});

app.get("/admin/customers", async (_, res) => {
  const customers = await User.find({}, "-password").sort({ username: 1 });
  res.json(customers);
});

app.patch("/admin/customers/:id/block", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "Not found" });
  user.blocked = !user.blocked;
  await user.save();
  res.json({ blocked: user.blocked });
});

// Generate invoice PDF
app.get("/orders/invoice/:orderId", async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const doc = new PDFDocument({ margin: 50 });
    let buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=invoice-${order._id}.pdf`);
      res.send(pdfData);
    });

    const customerName =
      order.customerInfo?.fullName ||
      order.shippingAddress?.fullName ||
      order.customerInfo?.username ||
      order.customerInfo?.name ||
      "Valued Customer";

    const invoiceDate = new Date(order.createdAt).toLocaleDateString();
    const totalAmount = order.totals?.total || 0;

    // === INVOICE DESIGN ===
    doc.rect(0, 0, doc.page.width, doc.page.height).fill("#fef3f0");
    doc.fillColor("black");

    doc.image("assets/logo.png", 250, 40, { width: 100 });
    doc.fontSize(24).text("Invoice", 0, 160, { align: "center" });
    doc.moveTo(240, 185).lineTo(360, 185).stroke("#c9a341");

    const yStart = 210;
    doc.fontSize(10).fillColor("#c9a341").text("INVOICE FROM", 50, yStart);
    doc.fontSize(12).fillColor("#000")
      .text("UrbanKicks", 50, yStart + 15)
      .text("Plot No.6, Lala Lajpat Rai Path", 50, yStart + 30)
      .text(" Nehru Place", 50, yStart + 45)
      .text("+91 1234567890", 50, yStart + 60);

    doc.fontSize(10).fillColor("#c9a341").text("INVOICE TO", 400, yStart);
    doc.fontSize(12).fillColor("#000")
      .text(customerName, 400, yStart + 15)
      .text(order.shippingAddress?.street || "Street N/A", 400, yStart + 30)
      .text(order.shippingAddress?.city || "City N/A", 400, yStart + 45)
      .text(order.customerInfo?.email || "", 400, yStart + 60);

    const tableTop = yStart + 100;
    doc.fontSize(12).fillColor("#000")
      .text("DESCRIPTION", 50, tableTop)
      .text("RATE", 250, tableTop, { width: 80, align: "right" })
      .text("QUANTITY", 330, tableTop, { width: 70, align: "right" })
      .text("SUBTOTAL", 450, tableTop, { width: 100, align: "right" });

    doc.moveTo(50, tableTop + 18).lineTo(550, tableTop + 18).stroke("#c9a341");

    let position = tableTop + 30;
    order.items.forEach((item) => {
      const subtotal = item.price * item.quantity;
      doc.fontSize(11).fillColor("#333")
        .text(item.title, 50, position)
        .text(`₹${item.price}`, 250, position, { width: 80, align: "right" })
        .text(`${item.quantity}`, 330, position, { width: 70, align: "right" })
        .text(`₹${subtotal}`, 450, position, { width: 100, align: "right" });
      position += 20;
    });

    doc.moveTo(50, position + 10).lineTo(550, position + 10).stroke("#c9a341");

    doc.fontSize(14).fillColor("#000")
      .text("TOTAL", 400, position + 30, { width: 100, align: "right" })
      .font("Helvetica-Bold").fontSize(16).fillColor("#c9a341")
      .text(`₹${totalAmount.toFixed(2)}`, 450, position + 30, { width: 100, align: "right" });

    const footerY = position + 100;
    doc.fontSize(10).fillColor("#c9a341").text("TERMS & CONDITIONS", 50, footerY);
    doc.fontSize(9).fillColor("#444")
      .text("All orders are final. No returns unless damaged or incorrect.", 50, footerY + 15, { width: 200 });

    doc.fontSize(10).fillColor("#c9a341").text("PAYMENT METHOD", 300, footerY);
    doc.fontSize(9).fillColor("#444")
      .text("Payments accepted via card, UPI, or wallet. Contact support for issues.", 300, footerY + 15, { width: 250 });

    doc.fontSize(10).fillColor("#c9a341").text("www.urbankicks.com", 0, footerY + 100, { align: "center" });

    doc.end();
  } catch (error) {
    console.error("❌ Failed to generate invoice:", error);
    res.status(500).json({ message: "Error generating invoice" });
  }
});


/* ───────── START SERVER ───────── */
app.listen(9000, () => console.log("🚀 API running on http://localhost:9000"));