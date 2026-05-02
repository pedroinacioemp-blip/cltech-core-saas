public class Example {
    public static void main(String[] args) {
        System.out.println();
        System.out.println("╔════════════════════════════════════╗");
        System.out.println("║  CL TECH CORE - Java Test Program  ║");
        System.out.println("╚════════════════════════════════════╝");
        System.out.println();

        // Test 1: Print simple message
        System.out.println("[✓] Teste 1: Hello from Java!");

        // Test 2: Arithmetic
        int a = 10, b = 20;
        System.out.println("[✓] Teste 2: " + a + " + " + b + " = " + (a + b));

        // Test 3: Loop
        System.out.println("[✓] Teste 3: Tabela de multiplicação (5):");
        for (int i = 1; i <= 5; i++) {
            System.out.println("    5 x " + i + " = " + (5 * i));
        }

        // Test 4: String
        String msg = "CL TECH CORE";
        System.out.println("[✓] Teste 4: Message: " + msg);

        System.out.println();
        System.out.println("[✓] Todos os testes passaram com sucesso!");
        System.out.println();
    }
}
