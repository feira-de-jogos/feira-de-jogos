# Mesa de Som
Projeto de uma mesa de som totalmente funcional com controles de áudio (equalização, amplificação, etc) e dispositivos de controle IoT. Ele foi iniciado a partir de uma solicitação da 8ª fase do semestre 2025.2. 


### Esboço da arquitetura de áudio: 
```mermaid
flowchart TD
    E0[Decodificador
    P2/Bt/USB] -->C0(Comutador de entrada 1)
    E1[RCA] -->
    C0 --> CG
    CG--> PA0[Pré-amplificador e 
    Equalizador 1]



    E2[XLR] -->C1(Comutador de entrada 2)
    E3[P10] -->
    C1 --> CG
    CG[Comutador Geral] --> PA1[Pré-amplificador e 
    Equalizador 1]

    PA0 --> A0{Amplificador 1}
    PA1 --> A1{Amplificador 2}



    A0 -->|Sinal Principal| S
    A1 -->|Sinal Secundário| S

    S[Bornes de Saída]

```