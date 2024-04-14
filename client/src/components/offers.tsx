import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { selectOffers } from "@/store/offer/offerSlice";

const Offers = () => {

    const offers = useSelector(selectOffers);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Offerenti</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome Offerente</TableHead>
                            <TableHead>Ribasso Offerto</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {offers.map((offer) => (
                            <TableRow key={offer.id}>
                                <TableCell>{offer.name_offer}</TableCell>
                                <TableCell>{offer.price_offer}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export default Offers