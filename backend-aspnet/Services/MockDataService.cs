// backend-aspnet/Services/MockDataService.cs
using backend_aspnet.Models;
using System.Collections.Generic;
using System.Linq;

namespace backend_aspnet.Services
{
    public class MockDataService
    {
        public static List<Stage> GetMockStages()
        {
            return new List<Stage>
            {
                new Stage { Id = "stage1", Name = "Màn 1: Nền tảng", Description = "Các cấu trúc dữ liệu cơ bản.", Order = 1, Difficulty = "Dễ", BackgroundUrl = "url1.webp" },
                new Stage { Id = "stage2", Name = "Màn 2: Cây và Đồ thị", Description = "Khám phá các cấu trúc phi tuyến.", Order = 2, Difficulty = "Dễ", BackgroundUrl = "url2.webp" },
                new Stage { Id = "stage3", Name = "Màn 3: Sắp xếp", Description = "Các thuật toán sắp xếp kinh điển.", Order = 3, Difficulty = "Trung bình", BackgroundUrl = "url3.jpg" },
                new Stage { Id = "stage4", Name = "Màn 4: Duyệt Đồ thị", Description = "Các thuật toán tìm đường đi.", Order = 4, Difficulty = "Trung bình", BackgroundUrl = "url4.webp" },
                new Stage { Id = "stage5", Name = "Màn 5: Quy hoạch động", Description = "Giải quyết các bài toán tối ưu.", Order = 5, Difficulty = "Khó", BackgroundUrl = "url5.webp" },
                new Stage { Id = "stage6", Name = "Màn 6: Xử lý Chuỗi", Description = "Các thuật toán tìm kiếm và so khớp.", Order = 6, Difficulty = "Khó", BackgroundUrl = "url6.webp" }
            };
        }

        // HÀM NÀY CHỨA TOÀN BỘ 24 CÂU HỎI
        public static List<Quiz> GetAllMockQuizzes()
        {
            return new List<Quiz>
            {
                // --- Màn 1: Nền tảng (4 câu) ---
                new Quiz { Id = "stage1_q1", StageId = "stage1", Question = "Cấu trúc dữ liệu nào hoạt động theo nguyên tắc FIFO (First-In, First-Out)?", Options = new List<string> { "Stack", "Queue", "Tree", "Graph" }, CorrectAnswerIndex = 1, Explanation = "Queue (Hàng đợi) hoạt động theo nguyên tắc vào trước, ra trước." },
                new Quiz { Id = "stage1_q2", StageId = "stage1", Question = "Độ phức tạp để truy cập một phần tử trong mảng theo chỉ số là gì?", Options = new List<string> { "O(n)", "O(log n)", "O(1)", "O(n^2)" }, CorrectAnswerIndex = 2, Explanation = "Truy cập mảng theo chỉ số là thao tác có thời gian không đổi O(1)." },
                new Quiz { Id = "stage1_q3", StageId = "stage1", Question = "Thao tác 'push' thuộc về cấu trúc dữ liệu nào?", Options = new List<string> { "Queue", "Linked List", "Stack", "Heap" }, CorrectAnswerIndex = 2, Explanation = "'Push' là thao tác thêm một phần tử vào đỉnh của Stack (ngăn xếp)." },
                new Quiz { Id = "stage1_q4", StageId = "stage1", Question = "Trong danh sách liên kết đơn, mỗi nút trỏ đến đâu?", Options = new List<string> { "Nút phía trước", "Nút tiếp theo", "Nút đầu danh sách", "Nút cuối danh sách" }, CorrectAnswerIndex = 1, Explanation = "Mỗi nút trong danh sách liên kết đơn chứa dữ liệu và một con trỏ đến nút kế tiếp." },

                // --- Màn 2: Cây và Đồ thị (4 câu) ---
                new Quiz { Id = "stage2_q1", StageId = "stage2", Question = "Nút không có bất kỳ nút con nào trong một cây được gọi là gì?", Options = new List<string> { "Nút gốc (Root)", "Nút trong (Internal)", "Nút cha (Parent)", "Nút lá (Leaf)" }, CorrectAnswerIndex = 3, Explanation = "Nút lá là các nút ở cuối cùng của một nhánh cây." },
                new Quiz { Id = "stage2_q2", StageId = "stage2", Question = "Trong Cây nhị phân tìm kiếm (BST), giá trị của nút con bên phải so với nút cha như thế nào?", Options = new List<string> { "Luôn nhỏ hơn", "Luôn lớn hơn hoặc bằng", "Luôn bằng", "Không xác định" }, CorrectAnswerIndex = 1, Explanation = "Trong một BST, tất cả các giá trị ở cây con bên phải đều lớn hơn hoặc bằng giá trị của nút cha." },
                new Quiz { Id = "stage2_q3", StageId = "stage2", Question = "Một tập hợp các đỉnh và các cạnh nối chúng được gọi là gì?", Options = new List<string> { "Mảng", "Cây", "Đồ thị", "Danh sách" }, CorrectAnswerIndex = 2, Explanation = "Đồ thị là một cấu trúc dữ liệu bao gồm các đỉnh (vertices) và các cạnh (edges) kết nối các cặp đỉnh." },
                new Quiz { Id = "stage2_q4", StageId = "stage2", Question = "Lỗi 'Stack Overflow' thường xảy ra khi duyệt cây bằng phương pháp nào không cẩn thận?", Options = new List<string> { "Duyệt theo chiều rộng (BFS)", "Duyệt đệ quy theo chiều sâu (DFS)", "Duyệt theo thứ tự giữa", "Không có phương pháp nào" }, CorrectAnswerIndex = 1, Explanation = "Duyệt đệ quy quá sâu mà không có điều kiện dừng có thể làm tràn bộ nhớ stack, gây ra lỗi Stack Overflow." },

                // --- Màn 3: Sắp xếp (4 câu) ---
                new Quiz { Id = "stage3_q1", StageId = "stage3", Question = "Thuật toán sắp xếp nào có độ phức tạp trung bình là O(n log n)?", Options = new List<string> { "Bubble Sort", "Insertion Sort", "Quick Sort", "Selection Sort" }, CorrectAnswerIndex = 2, Explanation = "Quick Sort và Merge Sort là hai thuật toán sắp xếp hiệu quả với độ phức tạp trung bình O(n log n)." },
                new Quiz { Id = "stage3_q2", StageId = "stage3", Question = "Thuật toán sắp xếp nào hoạt động bằng cách liên tục đổi chỗ các phần tử liền kề nếu chúng sai thứ tự?", Options = new List<string> { "Merge Sort", "Bubble Sort", "Quick Sort", "Heap Sort" }, CorrectAnswerIndex = 1, Explanation = "Bubble Sort (Sắp xếp nổi bọt) hoạt động bằng cách lặp đi lặp lại qua danh sách, so sánh các cặp liền kề và đổi chỗ chúng nếu cần." },
                new Quiz { Id = "stage3_q3", StageId = "stage3", Question = "Trường hợp xấu nhất của Quick Sort xảy ra khi nào?", Options = new List<string> { "Mảng đã được sắp xếp", "Mảng được sắp xếp ngược", "Pivot luôn được chọn là phần tử nhỏ nhất hoặc lớn nhất", "Tất cả các đáp án trên" }, CorrectAnswerIndex = 3, Explanation = "Tất cả các trường hợp trên đều có thể dẫn đến việc phân chia không cân bằng, khiến độ phức tạp của Quick Sort trở thành O(n^2)." },
                new Quiz { Id = "stage3_q4", StageId = "stage3", Question = "Thuật toán nào xây dựng một cấu trúc dữ liệu 'đống' (heap) để sắp xếp?", Options = new List<string> { "Heap Sort", "Tree Sort", "Radix Sort", "Merge Sort" }, CorrectAnswerIndex = 0, Explanation = "Heap Sort sử dụng cấu trúc dữ liệu heap để tìm phần tử lớn nhất (hoặc nhỏ nhất) và đặt nó vào cuối mảng." },

                // --- Màn 4: Duyệt Đồ thị (4 câu) ---
                new Quiz { Id = "stage4_q1", StageId = "stage4", Question = "Thuật toán duyệt đồ thị nào sử dụng cấu trúc dữ liệu Queue?", Options = new List<string> { "Depth-First Search (DFS)", "Breadth-First Search (BFS)", "Dijkstra", "A*" }, CorrectAnswerIndex = 1, Explanation = "BFS duyệt các đỉnh theo từng lớp, giống như nguyên tắc FIFO của Queue." },
                new Quiz { Id = "stage4_q2", StageId = "stage4", Question = "Thuật toán nào được dùng để tìm đường đi ngắn nhất trong đồ thị không có trọng số?", Options = new List<string> { "Dijkstra", "Bellman-Ford", "BFS", "DFS" }, CorrectAnswerIndex = 2, Explanation = "Trong đồ thị không có trọng số, BFS đảm bảo tìm ra đường đi ngắn nhất vì nó duyệt qua các đỉnh theo khoảng cách tăng dần từ đỉnh nguồn." },
                new Quiz { Id = "stage4_q3", StageId = "stage4", Question = "DFS (Duyệt theo chiều sâu) có nguy cơ gặp phải vấn đề gì nếu không được triển khai cẩn thận?", Options = new List<string> { "Lặp vô hạn trong đồ thị có chu trình", "Không tìm thấy tất cả các đỉnh", "Tốn quá nhiều bộ nhớ", "Chạy quá nhanh" }, CorrectAnswerIndex = 0, Explanation = "Nếu không đánh dấu các đỉnh đã được duyệt, DFS có thể bị kẹt trong một chu trình và lặp lại vô hạn." },
                new Quiz { Id = "stage4_q4", StageId = "stage4", Question = "Thuật toán Dijkstra dùng để làm gì?", Options = new List<string> { "Tìm cây bao trùm tối thiểu", "Phát hiện chu trình âm", "Tìm đường đi ngắn nhất trong đồ thị có trọng số không âm", "Sắp xếp topo" }, CorrectAnswerIndex = 2, Explanation = "Dijkstra là thuật toán kinh điển để tìm đường đi ngắn nhất từ một đỉnh đến tất cả các đỉnh khác trong đồ thị có trọng số không âm." },

                // --- Màn 5: Quy hoạch động (4 câu) ---
                new Quiz { Id = "stage5_q1", StageId = "stage5", Question = "Quy hoạch động phù hợp nhất để giải quyết loại bài toán nào?", Options = new List<string> { "Bài toán có các bài toán con gối nhau", "Bài toán có thể chia thành các phần độc lập", "Bài toán tìm kiếm đơn giản", "Bài toán sắp xếp" }, CorrectAnswerIndex = 0, Explanation = "Đặc điểm nhận dạng của bài toán có thể giải bằng quy hoạch động là sự tồn tại của các bài toán con gối nhau (overlapping subproblems)." },
                new Quiz { Id = "stage5_q2", StageId = "stage5", Question = "Kỹ thuật lưu lại kết quả của các bài toán con đã giải để tránh tính toán lại được gọi là gì?", Options = new List<string> { "Recursion (Đệ quy)", "Greedy (Tham lam)", "Memoization (Ghi nhớ)", "Iteration (Lặp)" }, CorrectAnswerIndex = 2, Explanation = "Memoization là một kỹ thuật tối ưu hóa được sử dụng để tăng tốc các chương trình máy tính bằng cách lưu trữ kết quả của các lệnh gọi hàm tốn kém." },
                new Quiz { Id = "stage5_q3", StageId = "stage5", Question = "Bài toán tính số Fibonacci thứ n là một ví dụ kinh điển của...", Options = new List<string> { "Thuật toán tham lam", "Quy hoạch động", "Tìm kiếm nhị phân", "Sắp xếp nổi bọt" }, CorrectAnswerIndex = 1, Explanation = "Việc tính F(n) dựa trên F(n-1) và F(n-2) cho thấy sự tồn tại của các bài toán con gối nhau, một đặc điểm của quy hoạch động." },
                new Quiz { Id = "stage5_q4", StageId = "stage5", Question = "Bài toán 'Dãy con chung dài nhất' (LCS) được giải quyết hiệu quả bằng phương pháp nào?", Options = new List<string> { "Chia để trị", "Quay lui", "Quy hoạch động", "Tham lam" }, CorrectAnswerIndex = 2, Explanation = "LCS là một ứng dụng kinh điển của quy hoạch động, thường được giải bằng cách xây dựng một bảng 2 chiều." },

                // --- Màn 6: Xử lý Chuỗi (4 câu) ---
                new Quiz { Id = "stage6_q1", StageId = "stage6", Question = "Thuật toán nào sử dụng hàm băm (hashing) để tìm kiếm chuỗi con một cách hiệu quả?", Options = new List<string> { "Knuth-Morris-Pratt (KMP)", "Boyer-Moore", "Rabin-Karp", "Tìm kiếm tuần tự" }, CorrectAnswerIndex = 2, Explanation = "Rabin-Karp tính giá trị băm cho chuỗi cần tìm và cho từng chuỗi con của văn bản để so sánh nhanh." },
                new Quiz { Id = "stage6_q2", StageId = "stage6", Question = "Mảng LPS (Longest Proper Prefix which is also Suffix) là một phần quan trọng của thuật toán nào?", Options = new List<string> { "Rabin-Karp", "KMP", "Boyer-Moore", "Aho-Corasick" }, CorrectAnswerIndex = 1, Explanation = "Thuật toán KMP sử dụng mảng LPS để bỏ qua các ký tự không cần thiết khi có sự không khớp, giúp tối ưu hóa việc trượt chuỗi." },
                new Quiz { Id = "stage6_q3", StageId = "stage6", Question = "Cấu trúc dữ liệu nào tối ưu cho việc tìm kiếm các từ có cùng một tiền tố?", Options = new List<string> { "Bảng băm", "Cây nhị phân", "Mảng", "Cây tiền tố (Trie)" }, CorrectAnswerIndex = 3, Explanation = "Trie được thiết kế đặc biệt để lưu trữ và truy vấn chuỗi, giúp các thao tác liên quan đến tiền tố trở nên rất nhanh." },
                new Quiz { Id = "stage6_q4", StageId = "stage6", Question = "Bài toán 'Chỉnh sửa khoảng cách' (Edit Distance) giữa hai chuỗi thường được giải bằng phương pháp nào?", Options = new List<string> { "Quy hoạch động", "Tham lam", "Chia để trị", "Duyệt đồ thị" }, CorrectAnswerIndex = 0, Explanation = "Bài toán tìm số thao tác tối thiểu (thêm, xóa, sửa) để biến chuỗi này thành chuỗi khác là một ứng dụng kinh điển của quy hoạch động." },
            };
        }

        public static List<User> GetMockUsers()
        {
            return new List<User>
            {
                new User { Id = "user1", Username = "testuser", Email = "test@test.com", Password = BCrypt.Net.BCrypt.HashPassword("test123"), Role = "User", Xp = 0, CompletedStages = new List<string>() },
                new User { Id = "admin1", Username = "admin", Email = "admin@test.com", Password = BCrypt.Net.BCrypt.HashPassword("admin123"), Role = "Admin", Xp = 100, CompletedStages = new List<string> { "stage1" } }
            };
        }
    }
}