import { forwardRef, useImperativeHandle } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { useSelector } from "react-redux";
import { Offer, selectOffers } from "@/store/offer/offerSlice";
import { useDispatch } from "react-redux";
import { Ranking, calculateRanking } from "@/store/rank/rankSlice";
import { selectMediaRibassi, selectMediaScarto, selectScartoOfferte, selectSogliaAnomala, selectSommaRibassi, upadteMediaRibassi, updateMediaScarto, updateScartoOfferte, updateSogliaAnomalia, updateSommaRibassi } from "@/store/stats/statsSlice";

export interface ICalculation {
    /**
     * 
     * @returns Calculation
     */
    doCalculation: () => void
}


const Calculation = forwardRef<ICalculation, unknown>(function Calculation(_, ref) {

    const dispatch = useDispatch();
    const offers = useSelector(selectOffers);
    const scartoOfferte = useSelector(selectScartoOfferte);
    const sommaRibassi = useSelector(selectSommaRibassi);
    const mediaRibassi = useSelector(selectMediaRibassi);
    const mediaScarti = useSelector(selectMediaScarto);
    const sogliaAnomala = useSelector(selectSogliaAnomala);

    function checkIfLowerThan15(offers: Offer[]) {
        if (offers.length < 15) return true;
        return false;
    }

    function doCalculation() {

        // Calcola il numero di offerte da scartare (10% delle offerte totali)
        const offersToDiscard = Math.ceil(offers.length * 0.1);
        dispatch(updateScartoOfferte(offersToDiscard));

        // Ordina le offerte in base al prezzo
        const sortedOffers = [...offers].sort((a, b) => parseFloat(a.price_offer) - parseFloat(b.price_offer));

        // Trova l'offerta con il minor prezzo (minimo ribasso)
        const minOffer = sortedOffers.slice(0, offersToDiscard);

        // Trova l'offerta con il maggior prezzo (massimo ribasso)
        const maxOffer = sortedOffers.slice(-offersToDiscard);

        // Filtra le offerte per rimuovere l'offerta con il minor e il maggior prezzo
        const filteredOffers = offers.filter(offer => !maxOffer.includes(offer) && !minOffer.includes(offer));

        // SR !: Somma Ribassi
        const SR = filteredOffers.reduce((acc, offer) => acc + parseFloat(offer.price_offer), 0).toFixed(4);
        dispatch(updateSommaRibassi(SR));
        console.log("Somma dei Ribassi: " + SR);

        // MAR !: Media Arimetica dei Ribassi
        const MAR = parseFloat(SR) / filteredOffers.length
        dispatch(upadteMediaRibassi(MAR));

        console.log("Media Artmetica dei Ribassi: " + MAR);

        /**
         * SC !: Scarto Aritmetico  dei ribassi superiori alla media arimetica dei ribassi
         * SMA !: Scarto Medio Aritmetico =# calcolo dello scarto medio aritmetico dei ribassi percentuali che superano la media calcolata (MAR)
         */
        const SC = filteredOffers.filter(offer => parseFloat(offer.price_offer) > MAR).map(offer => parseFloat(offer.price_offer) - MAR);

        console.log("Scarto Arimetico: " + SC);

        const SMA = SC.reduce((acc, sc) => acc + sc, 0) / SC.length;
        dispatch(updateMediaScarto(SMA));

        console.log("Scarto Medio Aritmetico: " + SMA)


        // CASE A
        if (!checkIfLowerThan15(offers)) {

            // SSM !: Soglia della somma delle medie:
            const SSM = SMA + MAR;

            // PDV !: Prodotto delle prime due cifre dopo la virgola della somma dei ribassi SR
            const PDV = SR.split('.')[1].slice(0, 2).split('').reduce((a, b) => a * parseInt(b), 1);

            // SDM !: Calcolo valore decremento somme medie
            const DSM = (PDV * 100) * SMA;

            // SA !: Soglia di anomalia || Theshold
            const SA = SSM - DSM;
            dispatch(updateSogliaAnomalia(SA));

            doRanking(SA)
        }

        // CASE B
        if (checkIfLowerThan15(offers)) {

            // CR !: Coefficiente R =# calcolo tra lo scarto medio aritmetico e la media aritmetica dei ribassi.
            const CR = SMA / MAR

            console.log("Coeficiente R: " + CR);

            // SA !: Soglia di anomalia || Theshold
            const SA = CR <= 0.15 ? (MAR * 1.2) : (MAR + SMA);
            dispatch(updateSogliaAnomalia(SA));

            doRanking(SA);
        }

        // CASE C
        // CR !: Coefficiente R =# calcolo tra lo scarto medio aritmetico e la media aritmetica dei ribassi.
        const CR = SMA / MAR

        if (CR <= 0.15) {

            // SA !: Soglia di anomalia || Theshold
            const SA = MAR * 1.2
            dispatch(updateSogliaAnomalia(SA));

            doRanking(SA);
        }
    }

    function doRanking(theshold: number) {

        // Filtra le offerte che superano la soglia di anomalia
        const thesholdOffers = offers.filter(offer => parseFloat(offer.price_offer) <= theshold);

        // Ordina le offerte rimanenti in ordine decrescente di valore dell'offerta
        thesholdOffers.sort((a, b) => parseFloat(b.price_offer) - parseFloat(a.price_offer));

        // Assegna posizioni di ranking basate sull'ordine nella lista ordinata
        const ranking: Ranking[] = thesholdOffers.map((offer: Offer, index) => ({
            ...offer,
            position: index + 1,
        }))

        dispatch(calculateRanking(ranking));
    }

    useImperativeHandle(ref, () => {
        return {
            doCalculation
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [offers]);


    return (
        <Card>
            <CardHeader>
                <CardTitle>Calcoli</CardTitle>
            </CardHeader>
            <CardContent>
                <Table >
                    <TableHeader>
                        <TableRow>
                            <TableHead>Dettaglio</TableHead>
                            <TableHead>Valore</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>Numero Offerte Ammesse</TableCell>
                            <TableCell>{offers.length}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Numero Offerte (10% Ali)</TableCell>
                            <TableCell>{scartoOfferte}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>SR (Somma Ribassi)</TableCell>
                            <TableCell>{sommaRibassi}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>MR (Media Ribassi)</TableCell>
                            <TableCell>{mediaRibassi}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>MS (Media Scarti)</TableCell>
                            <TableCell>{mediaScarti}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>SA (Soglia Anomala)</TableCell>
                            <TableCell>{sogliaAnomala}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
})

export default Calculation