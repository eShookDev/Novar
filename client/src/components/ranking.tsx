import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { selectRanking } from "@/store/rank/rankSlice";


const Ranking = () => {

    const ranking = useSelector(selectRanking);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Classifica</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Posizione</TableHead>
                            <TableHead>Nome Offerente</TableHead>
                            <TableHead>Offerta Ribasso</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ranking.map((rank) => (
                            <TableRow
                                key={rank.id}
                                className={rank.price_offer}
                            >
                                <TableCell>{rank.position}</TableCell>
                                <TableCell>{rank.name_offer}</TableCell>
                                <TableCell>{rank.price_offer}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export default Ranking;