import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
public class AssetServer {
    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        server.createContext("/addAsset", new AddAssetHandler());
        server.setExecutor(null);
        server.start();
        System.out.println("Server started at http://localhost:8080");
    }

    static class AddAssetHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("POST".equals(exchange.getRequestMethod())) {
                String body = new String(exchange.getRequestBody().readAllBytes());
                System.out.println("Request Body: " + body);
                String[] params = body.split("&");
                String assetName = "";
                double assetAmount = 0;
                for (String param : params) {
                    String[] pair = param.split("=");
                    if (pair.length == 2) {
                        String key = URLDecoder.decode(pair[0], StandardCharsets.UTF_8);
                        String value = URLDecoder.decode(pair[1], StandardCharsets.UTF_8);
                        if (key.equals("name")) {
                            assetName = value;
                        } else if (key.equals("amount")) {
                            assetAmount = Double.parseDouble(value);
                        }
                    }
                }
                addAsset(assetName, assetAmount);
                String response = "Asset added successfully!";
                exchange.sendResponseHeaders(200, response.length());
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(response.getBytes());
                }
            } else {
               
                exchange.sendResponseHeaders(405, -1); 
            }
        }
        private void addAsset(String assetName, double assetAmount) {
            String query = "INSERT INTO assets (asset_name, asset_amount, date_added) VALUES (?, ?, CURDATE())";
            try (Connection connection = DatabaseConnection.getConnection();
                 PreparedStatement stmt = connection.prepareStatement(query)) {
                stmt.setString(1, assetName);
                stmt.setDouble(2, assetAmount);
                stmt.executeUpdate();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
    static class Asset {
        private String name;
        private double amount;
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public double getAmount() { return amount; }
        public void setAmount(double amount) { this.amount = amount; }
    }
}



