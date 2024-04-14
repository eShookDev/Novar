import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store';

export interface Offer {
  id: string;
  name_offer: string;
  price_offer: string;
}

const initialState = {
  offers: [] as Offer[],
}

export const offerSlice = createSlice({
  name: 'offer',
  initialState,
  reducers: {
    addOffer(state, action: PayloadAction<Offer>) {
      state.offers.push(action.payload);
    },
    removeOffer(state, action: PayloadAction<string>) {
      state.offers = state.offers.filter(offer => offer.id !== action.payload);
    },
    resetOffers(state){
      state.offers = []
    }
  }
})

// Action creators are generated for each case reducer function
export const { addOffer, removeOffer, resetOffers } = offerSlice.actions

// Selectors 
export const selectOffers = (state: RootState) => state.offer.offers;

export default offerSlice.reducer