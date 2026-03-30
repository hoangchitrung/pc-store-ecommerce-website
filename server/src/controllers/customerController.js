const db = require("../config/db");

exports.getCustomers = async (req, res) => {
    try {
        const [rows] = await db.promise().query(`
      SELECT 
        id,
        fullname,
        email,
        phone,
        role,
        is_active,
        created_at
      FROM users
      WHERE role = 'customer'
      ORDER BY id DESC
    `);

        res.json(rows);

    } catch (error) {
        console.error("🔥 Get customers error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};