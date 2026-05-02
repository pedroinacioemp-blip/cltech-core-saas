#include <iostream>
#include <string>
using namespace std;

int main() {
    cout << "\n" << endl;
    cout << "╔════════════════════════════════════╗" << endl;
    cout << "║  CL TECH CORE - C++ Test Program  ║" << endl;
    cout << "╚════════════════════════════════════╝" << endl;
    cout << "\n" << endl;
    
    // Test 1: Print simple message
    cout << "[✓] Teste 1: Hello from C++!" << endl;
    
    // Test 2: Arithmetic
    int a = 10, b = 20;
    cout << "[✓] Teste 2: " << a << " + " << b << " = " << (a + b) << endl;
    
    // Test 3: Loop
    cout << "[✓] Teste 3: Tabela de multiplicação (5):" << endl;
    for (int i = 1; i <= 5; i++) {
        cout << "    5 x " << i << " = " << (5 * i) << endl;
    }
    
    // Test 4: String
    string msg = "CL TECH CORE";
    cout << "[✓] Teste 4: Message: " << msg << endl;
    
    cout << "\n[✓] Todos os testes passaram com sucesso!" << endl;
    cout << "\n" << endl;
    
    return 0;
}
