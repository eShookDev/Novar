import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store';


const initialState = {
    scartoOfferte: 0,
    sommaRibassi: "",
    mediaRibassi: 0,
    mediaScarto: 0,
    sogliaAnomala: 0
}

export const statsSlice = createSlice({
    name: 'stats',
    initialState,
    reducers: {
        updateScartoOfferte(state, action: PayloadAction<number>) {
            state.scartoOfferte = action.payload
        },
        updateSommaRibassi(state, action: PayloadAction<string>){
            state.sommaRibassi = action.payload
        },
        upadteMediaRibassi(state, action: PayloadAction<number>){
            state.mediaRibassi = action.payload
        },
        updateMediaScarto(state, action: PayloadAction<number>){
            state.mediaScarto = action.payload
        },
        updateSogliaAnomalia(state, action: PayloadAction<number>){
            state.sogliaAnomala = action.payload
        },
        resetCalculation(state){
            state.scartoOfferte = 0,
            state.sommaRibassi = "",
            state.mediaRibassi = 0,
            state.mediaScarto = 0,
            state.sogliaAnomala = 0
        }
    }
})

// Action creators are generated for each case reducer function
export const { updateScartoOfferte, updateSommaRibassi, upadteMediaRibassi, updateMediaScarto, updateSogliaAnomalia, resetCalculation } = statsSlice.actions

// Selectors 
export const selectScartoOfferte = (state: RootState) => state.stats.scartoOfferte;
export const selectSommaRibassi = (state: RootState) => state.stats.sommaRibassi;
export const selectMediaRibassi = (state: RootState) => state.stats.mediaRibassi;
export const selectMediaScarto = (state: RootState) => state.stats.mediaScarto;
export const selectSogliaAnomala = (state: RootState) => state.stats.sogliaAnomala;

export default statsSlice.reducer