const fs = require("fs");
const path = require("path");

function generateSQL() {
    const jsonPath = path.join(process.cwd(), "data", "real_carwashes.json");
    const rawData = fs.readFileSync(jsonPath, "utf-8");
    const rawCarWashes = JSON.parse(rawData);

    let sql = "DELETE FROM carwash_locations WHERE id != '00000000-0000-0000-0000-000000000000';\n\n";
    sql += "INSERT INTO carwash_locations (name, address, prefecture, city, latitude, longitude, opening_hours, Is_24h, has_high_pressure, has_auto_gate_nonbrush, has_vacuum, has_foam, has_wax, has_air_gun, base_price, payment_methods) VALUES\n";

    const values = rawCarWashes.map(shop => {
        // 住所パース
        const match = shop.address.match(/(.+?[都道府県])(.+?[市区町村])/);
        const prefecture = match ? match[1] : "東京都";
        const city = match ? match[2] : "";

        const is24h = shop.opening_hours.includes("24時間");

        let price = "NULL";
        if (shop.notes) {
            const priceMatch = shop.notes.match(/(\d{3,})/);
            if (priceMatch) price = priceMatch[1];
        }

        const payments = shop.payment_methods ? shop.payment_methods.split(",").map(s => `"${s.trim()}"`).join(",") : "";
        const paymentsArray = `{${payments}}`; // PostgreSQL array format

        return `(
      '${shop.name.replace(/'/g, "''")}',
      '${shop.address.replace(/'/g, "''")}',
      '${prefecture}',
      '${city}',
      ${shop.latitude},
      ${shop.longitude},
      '${shop.opening_hours}',
      ${is24h},
      ${shop.has_high_pressure_washer || false},
      ${shop.has_non_brush_washing_machine || false},
      ${shop.has_vacuum || false},
      false,
      false,
      false,
      ${price},
      '${paymentsArray}'
    )`;
    });

    sql += values.join(",\n") + ";";

    const sqlPath = path.join(process.cwd(), "data", "seed_real_data.sql");
    fs.writeFileSync(sqlPath, sql);
    console.log(`✅ SQL file generated at: ${sqlPath}`);
}

generateSQL();
