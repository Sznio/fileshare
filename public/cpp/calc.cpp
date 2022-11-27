#include <iostream>
#include <cmath>
#include <vector>

double dod(const double*);
double ode(const double*);
double pom(const double*);
double pod(const double*);
double pie(const double*);
double ext(const double*);

struct Wyj{
    const char* msg;
};

struct Funktor{
    double (*wskF)(const double*);
    const char* opis;
    int opc{};
};

int main(){
    Funktor dod_f{dod, "Dodawanie" ,2};
    Funktor ode_f{ode, "Odejmowanie" ,2};
    Funktor pom_f{pom, "Mnozenie" ,2};
    Funktor pod_f{pod, "Dzielenie" ,2};
    Funktor pie_f{pie, "Pierwiastkowanie" ,1};
    Funktor ext_f{ext, "Wyjdz" ,0};
    std::vector<Funktor> tab_f{dod_f,ode_f,pom_f,pod_f,pie_f, ext_f};
    
    const int tab_f_size = tab_f.size();
    bool firstComp = true;
    for(int i = 0; i < tab_f_size; ++i){
            std::cout<<'\t'<<i+1<<": "<<tab_f[i].opis<<std::endl;
        }
    while(true){
        
        std::cout<<"Wybierz operacje: ";
        int odp;

        std::cin>>odp;
        std::cout<<"\033[A\33[2K\r";
        if(!firstComp){
        std::cout<<"\033[A\33[2K\r";
        }

        if((odp < 1) || odp > tab_f_size){
            continue;
        }

        const int op_count = tab_f[odp-1].opc;
        double *argArray = new double[op_count];
        for(int i=0; i<op_count;++i){
            std::cout<<"Podaj "<<i+1<<" operand: ";
            
            double odp{};
            std::cin>>odp;
            std::cout<<"\033[A\33[2K\r";
            argArray[i] = odp;
        }
        try{
            double wynik = tab_f[odp-1].wskF(argArray);
            std::cout<<"Wynik: "<<wynik<<std::endl;
        } catch(const Wyj& wyj_o){
            std::cout<<"Blad: "<<wyj_o.msg<<std::endl;
        }
        firstComp = false;
        
   

        delete[]argArray;

    }


}

double dod(const double* argArray){return argArray[0] + argArray[1];};
double ode(const double* argArray){return argArray[0] - argArray[1];};
double pom(const double* argArray){return argArray[0] * argArray[1];};
double pod(const double* argArray){
    if(argArray[1] == 0){throw Wyj{"Nie wolno dzielic przez zero!"};}
    return argArray[0] / argArray[1];
};
double pie(const double* argArray){
    if(argArray[0] < 0){
        throw Wyj{"Nie ma takiego pierwiastka w zbiorze liczb rzeczywistych!"};
    }
    return std::sqrt(argArray[0]);
};
double ext(const double* argArray){std::exit(0);}