
import { Calculator, Home, PanelLeft, PlusCircle, RotateCcw, } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { Offer, addOffer, resetOffers, selectOffers } from "@/store/offer/offerSlice"

import { v4 as uuidv4 } from 'uuid';
import { useRef, useState } from "react"
import { Link } from "react-router-dom"
import { ICalculation } from "@/components/calculation"
import { resetRanking, selectRanking } from "@/store/rank/rankSlice"

import { Offers, Ranking, Calculation } from "@/components";
import { resetCalculation } from "@/store/stats/statsSlice"

const formSchema = z.object({
    name_offer: z.string().min(2, {
        message: "Offer name must be at least 2 characters.",
    }),
    price_offer: z.coerce.number()
})


export function HomePage() {

    const dispatch = useDispatch();
    const offers = useSelector(selectOffers);
    const ranking = useSelector(selectRanking);

    const [open, setOpen] = useState(false);

    const calculationRef = useRef<ICalculation>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name_offer: "",
            price_offer: 0
        }
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        const newOffer: Offer = {
            id: uuidv4(),
            name_offer: values.name_offer,
            price_offer: values.price_offer.toFixed(4),
        };
        dispatch(addOffer(newOffer));
        setOpen(false);
    }

    function checkIfLowerThan5(offers: Offer[]) {
        if (offers.length < 5) return true;
        return false;
    }

    function checkDoCalculation() {
        if (ranking.length > 0) {
            dispatch(resetRanking());
        }

        return true
    }

    function handleDoCalculation() {
        if (checkIfLowerThan5(offers)) return;

        if (checkDoCalculation()) {
            if (calculationRef.current) calculationRef.current.doCalculation()
        }
    }

    function handleDoReset() {
        dispatch(resetRanking());
        dispatch(resetOffers());
        dispatch(resetCalculation());
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
                <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    to="#"
                                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                                >
                                    <Home className="h-5 w-5" />
                                    <span className="sr-only">Dashboard</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">Dashboard</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </nav>
            </aside>
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button size="icon" variant="outline" className="sm:hidden">
                                <PanelLeft className="h-5 w-5" />
                                <span className="sr-only">Toggle Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="sm:max-w-xs">
                            <nav className="grid gap-6 text-lg font-medium">
                                <Link
                                    to="#"
                                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                                >
                                    <Home className="h-5 w-5" />
                                    Dashboard
                                </Link>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </header>
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                    <Tabs defaultValue="method_a">
                        <div className="flex items-center">
                            <TabsList>
                                <TabsTrigger value="method_a">Metodo A</TabsTrigger>
                                <TabsTrigger value="method_b">Metodo B</TabsTrigger>
                                <TabsTrigger value="method_c">Metodo C</TabsTrigger>
                            </TabsList>
                            <div className="ml-auto flex items-center gap-2">
                                <Button size="sm" className="h-8 gap-1" onClick={handleDoReset}>
                                    <RotateCcw className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                        Reset
                                    </span>
                                </Button>
                                <Button
                                    size="sm"
                                    className={`h-8 gap-1 ${checkIfLowerThan5(offers) ? 'bg-[#FF0000] hover:bg-[#fe4d4d]' : 'bg-[#008000] hover:bg-[#4ca64c]'}`}
                                    onClick={handleDoCalculation}
                                >
                                    <Calculator className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                        Calcolo
                                    </span>
                                </Button>
                                <Dialog open={open} onOpenChange={setOpen}>
                                    <DialogTrigger asChild onClick={() => setOpen(true)}>
                                        <Button size="sm" className="h-8 gap-1">
                                            <PlusCircle className="h-3.5 w-3.5" />
                                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                                Aggiungi
                                            </span>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <Form {...form}>
                                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                                <DialogHeader>
                                                    <DialogTitle>Nuova Offerta</DialogTitle>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <FormField
                                                        control={form.control}
                                                        name="name_offer"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Nome Offerente</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="Nome dell' offerente" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="price_offer"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Prezzo Ribasso Offerente</FormLabel>
                                                                <FormControl>
                                                                    <Input type="number" placeholder="Prezzo al ribasso offerto" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <DialogFooter>
                                                    <Button type="submit">Invia</Button>
                                                </DialogFooter>
                                            </form>
                                        </Form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                        <TabsContent value="method_a">
                            <div className="grid grid-cols-3 gap-8">
                                <Offers />
                                <Ranking />
                                <Calculation ref={calculationRef} />
                            </div>
                        </TabsContent>
                    </Tabs>
                </main>
            </div>
        </div>
    )
}
