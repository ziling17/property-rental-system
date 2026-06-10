import { Property, Bank, Wallet } from "./types";

export const PROPERTIES: Property[] = [
    {
        id: "horizon-residences",
        name: "The Horizon Residences",
        location: "Bukit Bintang, KL",
        firstMonthRent: 2800,
        securityDepositMultiplier: 2,
        utilityDepositMultiplier: 0.5,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCsHrgnGAFoWGo_uZLDXg1CsOscT1AmHaRXbNf1Jr9hUdy8Q6stK56MoweymyXJo5MzcvZ76N3KPo3UDpo_6rcTP7zV2BZ1szEa6NZnafjTW15gXJPvDc7LWWccmYjNZ12XPRxLsCPX4So0NxjfJkYNgGotrIYSZmEcCLRyzUaJwrZrXPBZDiFZ9PeF0OvzmYJIpUVNE6Yoc-AV6iRKYoGYMjmerXYIwKfT5Pc8q0vkfOo68-Ns_fx6nptHg_F4_hS28nkItZUETCw",
        verified: true,
    },
    {
        id: "bangsar-heights",
        name: "Bangsar Heights Suites",
        location: "Bangsar, Kuala Lumpur",
        firstMonthRent: 3200,
        securityDepositMultiplier: 2,
        utilityDepositMultiplier: 0.5,
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=500&q=80",
        verified: true,
    },
    {
        id: "kiara-hills-villa",
        name: "Kiara Hills Modern Villa",
        location: "Mont Kiara, KL",
        firstMonthRent: 4500,
        securityDepositMultiplier: 2,
        utilityDepositMultiplier: 0.5,
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=500&q=80",
        verified: true,
    }
];

export const BANKS: Bank[] = [
    {
        id: "maybank",
        name: "Maybank2u",
        logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQPrLU0xlwdJ02U8dfCJLzYypDJzNHQc4UzLD-SmAtwdZA8CtQ8beDMTgUrPYxQxCNqbsz9nx9LZZ8LowY9flIN9XCZk6Eut4ySPVMdMBAzZWq8KPKS_CLxs_UnrLq-BRJlRZ5S4FS39aaY-yAezEZ6wzFfbeFFiLnknWB2WRLLb11iiApf2RbCnNwI07EXgSUrKLMkzoVxJpqH-DPrVgCmfEwNGqjif1dUb76ppXArtqaSzJFwmax4Qivk2Pct0he7uupK7EtUmY",
    },
    {
        id: "cimb",
        name: "CIMB Clicks",
        logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAbOHlPkkuaYh1O-pYHHzpOPxotpibuNoAoFZ29yk7RF6WIM1mrnYwk6zEdHD1JUBsJ1c9Qw74z8trdMCoYgLoAwjN0kzu-N6bnvlS9dlysYGNXu8SrZyEHuam-c_t6W7pZZV9MI1bCPvngfwPli5xmm4ZbllmwL1sEpDcYiyK8mjFPQcvs-fPcRsBrpvNToa-YpHPH4DeTa2o852mcjs-kL5Dc0tw0byKcxx9tUlOh7X7FL5RnphhTXmb2GBDIdM-8sTHy5nOZqSs",
    },
    {
        id: "pbb",
        name: "Public Bank",
        logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBsZ-J6szmBQcqzH8DJTNSZ2poWQ-FCDrvgE_neHksWKrOJ_21KSG9RdVyXBrlnZm9DaUpawhC2nb-uhI5GDuk-CrumF5glHD1gmecteqa_6Mtm2vGMy8-YN_vgaVcRmujK-SWk5avI574XJAPNoF_rEYSlokMelDs4Apr97LNAOvyVE9yXIG_x0Wb3tbEzevUbu_u3j57ox_830kh-oqnpjYOPWeo2ISudBq93t9e7OH1kkMRHN4QO_M3KN5ORHad4eI41RCJUxsw",
    },
    {
        id: "rhb",
        name: "RHB Now",
        logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-YQnHy9HdnNektaleKJerhZo1Y9D9e56VDJj0fgiTN8dOa9KukEL_v65DmkuUD_KmdffDKOi-INOSB99_Cgun59nuQQX0C2nnFvbXHPz8oVYkfZvsmGSWpiwV1NbIAqQkmJc3Dz_lBuvZZnswKl50tZDTrE97U9hEDwmnnFR7eLorb8ElPoqwWU2bDZbdezGxiMhTQyjM8vNic4XFigRialsxVK7fXQmxzFQNUsZK05G2BpVsno7zMJOfuzfnIBrjeYZFXfcdYYw",
    },
    {
        id: "ambank",
        name: "AmOnline",
        logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuD3Xt7upz9o4AMA3OJllyU4GUWOpx4L-IN_uiu5uDbRY_ka4-Aw1vME0vbaJtUs7cfetuP-LyGnIQLyCt0RubtmmSKQfbKeOICMYml7cBcRBFjikMq66uBQd20pM2kKoY5hYI7gP8sVfsSySj6GWFWgPiWZPCUz-7EwppqDwd51y_WTG1WYeQdAVwObNZ-At0YL-CM48NtRGxM2Gsu8yZDaJ5V-1vgBkprr6lHBeUb0Par_xeZBD0Z-txs2t0tIP2KUPQBi9WeR0BA",
    },
    {
        id: "hlb",
        name: "HLB Connect",
        logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7nCugebTVnclED9Iln84sg5UkJWvTbTaiXYZW-U4VB67ZhAILJfmcUCwYDKqjlKXuJPcqC0djChXLreSI19Z6T6YQ-L8Z6uY-SDM2DLEPX9PAd2NaHtFksGpRyrvdfntUq8aqbpMeZ8apoqEa7DGpqXHKeJmrvNEgeYYA3c4ZKE8nM95cmzIKuylLJTcsCHvtI2_ZNbSFHZwU8rthSxzM_0Kc-lbL_Tdm24CXiNrhIBx5hN7Bxw_GD8SH9O8MfOAdYwykjMajGvY",
    }
];

export const WALLETS: Wallet[] = [
    {
        id: "grabpay",
        name: "GrabPay",
        logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDyjXE-0E61e_MGSdmgETlvsS1IMamUo2CnOmGLxQAt1k1YLtz5Lk2lQtMLNVrr3STxAURu8Vw7i-0OvW2j_S1upbg0MHRq8AYeZqXU8z5nRGZbAHQ4MFdOqNjNcJIDlZjgWBDGIv-2d05jWcWVewOfLzKAzUDSeWmQVjINh0WTUOuZyR_VfPi3pLjygQR3FVIjA0GHitnt0voQXN_Xvvu2agM1nPB_BhgMX8iujjH9G2wZft7y71G33qD9XeLC9VhJLIc23UFz9TU",
    },
    {
        id: "tng",
        name: "Touch 'n Go",
        logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCBisAnKvJR4LigRTW15j1x1h0oXGszEVs2QWDBYWcswbmuIhcYf05-dic8J70l1SevGJjn7ySH2nr_0eRfTpf6neLug_hr5vl70Awk6Z_E74n7SqXBCxsvRcU1POiM7r_ET2gvghnJCUi3-J28-DApgk2SzHMHVV4xX-RdC3FTOaeVhf_Y4Fqsi4JgqzRKm_KJMi29OpCe31N7Yw0woPYRM2uxv2F_dMdGL96PSHMipFwsvPpMBuai354AgjQSCywr-kKMU2JsF7c",
    }
];
