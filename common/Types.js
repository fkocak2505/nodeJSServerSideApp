global.DocTypeGroupEnum = {
    UNDEFINED: "can_not_be_identified",
    CREDIT_CARD: "cce",
    FLIGHT_TICKET: "flight_ticket",
    POLICY: "policy",
    EVENT_TICKET: "event_ticket",
    INVOICE: "invoice",
    BUS_TICKET: "bus_ticket"
}


global.DocTypeEnum = {
    UNDEFINED: "can_not_be_identified",
    CREDIT_CARD_MAXIMILES: "Maximiles",
    CREDIT_CARD_BONUS: "Bonus",
    CREDIT_CARD_AXESS: "Axess",
    CREDIT_CARD_INGBANK: "IngBank",
    CREDIT_CARD_ZIRAAT: "Ziraat",
    FLIGHT_TICKET_ANADOLUJET: "Anadolujet Uçak Bileti",
    FLIGHT_TICKET_THY: "Thy Uçak Bileti",
    FLIGHT_TICKET_PEGASUS: "Pegasus Uçak Bileti",
    POLICY_INSURANCE_ZIRAAT: "Ziraat Konut",
    POLICY_INSURANCE_AK: "Ak Kasko",
    POLICY_INSURANCE_SOMPO: "Sompo Kasko",
    POLICY_INSURANCE_SBN: "Sbn İşyeri",
    EVENT_TICKET_BILETIX: "Biletix Etkinlik Bileti",
    EVENT_TICKET_MYBILET: "Mybilet Etkinlik Bileti",
    EVENT_TICKET_PASSO: "Passo Etkinlik Bileti",
    INVOICE_AVEA: "Avea Fatura",
    INVOICE_DIGITURK: "Digiturk Fatura",
    INVOICE_VODAFONE: "Vodafone Fatura",
    BUS_TICKET_METRO: "Metro Otobüs Bileti",
    FLIGHT_TICKET_PEGASUS_PDF: "Pegasus Uçak Bileti Pdf",
    BUS_TICKET_PAMUKKALE: "Pamukkale Otobüs Bileti",
    BUS_TICKET_ULUSOY: "Ulusoy Otobüs Bileti",
    BUS_TICKET_KAMILKOC: "Kamil Koç Otobüs Bileti",
    BUS_TICKET_IDO: "İstanbul Deniz Otobüs Bileti"

}


global.FirmTypeEnum = {
    ISBANK: "İşbank",
    VAKIFBANK: "Vakıfbank",
    FINANSBANK: "Finansbank",
    GARANTI: "Garanti",
    AKBANK: "Akbank",
    INGBANK: "IngBank",
    ZIRAAT: "Ziraat",
    AK: "AkSigorta",
    SOMPO: "Sompo",
    SBN: "SBN Sigorta",
    ANADOLUJET: "AnadoluJet",
    THY: "Türk Hava Yolları",
    PEGASUS: "Pegasus",
    BILETIX: "Biletix",
    MYBILET: "MyBilet",
    PASSO: "Passo",
    AVEA: "Avea",
    DIGITURK: "Digiturk",
    VODAFONE: "Vodafone",
    METRO: "Metro Turizm",
    PAMUKKALE: "Pamukkale Turizm",
    ULUSOY: "Ulusoy",
    KAMILKOC: "Kamil Koç",
    IDO: "İstanbul Deniz Otobüsler"
}

global.MetaTypeEnum = {
    BELGE_TURU_GRUBU: "BELGE_TURU_GRUBU",
    BELGE_TURU: "BELGE_TURU",
    BELGEYI_VEREN_FIRMA: "BELGEYI_VEREN_FIRMA",
    MUSTERI_NUMARASI: "MUSTERI_NUMARASI",
    KREDI_KART_NUMARASI: "KREDI_KART_NUMARASI",
    HESAP_KESIM_TARIHI: "HESAP_KESIM_TARIHI",
    HESAP_OZETI_BORCU: "HESAP_OZETI_BORCU",
    ACENTE_KODU: "ACENTE_KODU",
    POLICE_NUMARASI: "POLICE_NUMARASI",
    BASLAMA_TARIHI: "BASLAMA_TARIHI",
    BITIS_TARIHI: "BITIS_TARIHI",
    BRUT_PRIM: "BRUT_PRIM",
    NET_PRIM: "NET_PRIM",
    BILET_NUMARASI: "BILET_NUMARASI",
    REZERVASYON_KODU: "REZERVASYON_KODU",
    ISLEM_GRUBU: "ISLEM_GRUBU",
    ISLEM_GRUBU_TARIHI: "ISLEM_GRUBU_TARIHI",
    ISLEM_GRUBU_DETAYI: "ISLEM_GRUBU_DETAYI",
    ISLEM_GRUBU_TUTARI: "ISLEM_GRUBU_TUTARI",
    KALKIS_YERI: "KALKIS_YERI",
    VARIS_YERI: "VARIS_YERI",
    AKTARMA_DURUMU: "AKTARMA_DURUMU",
    KALKIS_TARIHI: "KALKIS_TARIHI",
    KALKIS_SAATI: "KALKIS_SAATI",
    VARIS_TARIHI: "VARIS_TARIHI",
    VARIS_SAATI: "VARIS_SAATI",
    KOLTUK_NO: "KOLTUK_NO",
    KABIN_TURU: "KABIN_TURU",
    CHECK_IN_DURUMU: "CHECK_IN_DURUMU",
    ETKINLIK_YERI: "ETKINLIK_YERI",
    ETKINLIK_ADI: "ETKINLIK_ADI",
    ETKINLIK_TARIHI: "ETKINLIK_TARIHI",
    ETKINLIK_SAATI: "ETKINLIK_SAATI",
    FATURA_NO: "FATURA_NO",
    TELEFON_NO: "TELEFON_NO",
    ODENECEK_TUTAR: "ODENECEK_TUTAR",
    SON_ODEME_TARIHI: "SON_ODEME_TARIHI",
    BELGE_NUMARASI: "BELGE_NUMARASI",
    UYE_NO: "UYE_NO",
    MUSTERI_ADI: "MUSTERI_ADI",
    REFERANS_NO: "REFERANS_NO",
    TUTAR: "TUTAR"
}

global.MetaStructEnum = {
    STRING: "STRING",
    FLOAT: "FLOAT",
    INTEGER: "INTEGER",
    DATE: "DATE",
    TIME: "TIME",
    AIRPORT: "AIRPORT",
    COUNTRY: "COUNTRY",
    CITY: "CITY"
}


global.ActionConditionEnum = {
    INCLUDES: "Includes",
    EQUALS: "Equals",
    NOT_EQUALS: "NotEquals",
    BIGGER: "Bigger",
    BIGGER_EQUAL: "BiggerEqual",
    LOWER: "Lower",
    LOWER_EQUAL: "LowerEqual",
    SMALLER: "Smaller"
}

global.ActionTriggerEnum = {
    EMAIL: "Email",
    SLACK: "Slack",
    SMS: "SMS"
}
