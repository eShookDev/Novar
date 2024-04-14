import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store';
import { Offer } from '../offer/offerSlice';

export interface Ranking extends Offer {
    position: number;
}

const initialState = {
    ranking: [] as Ranking[],
}

export const rankSlice = createSlice({
    name: 'rank',
    initialState,
    reducers: {
        calculateRanking(state, action: PayloadAction<Ranking[]>) {
            state.ranking.push(...action.payload);
        },
        resetRanking(state){
            state.ranking = []
        }
    }
})

// Action creators are generated for each case reducer function
export const { calculateRanking, resetRanking } = rankSlice.actions

// Selectors 
export const selectRanking = (state: RootState) => state.rank.ranking;

export default rankSlice.reducer