import { createSlice } from "@reduxjs/toolkit";

export const teamSlice = createSlice({
    name: "member",
    initialState: { teams: [] },
    reducers: {
        addTeam: (state, action) => {
            const teamExists = state.teams.some(team => team.id === action.payload.id);
            if (!teamExists) {
                state.teams.push(action.payload);
            }
        },

        removeALl: (state) => {
            state.teams = [];
        },

        addPlayerToTeam: (state, action) => {
            const { teamId, player } = action.payload;
            const team = state.teams.find(team => team.id === teamId);
            if (team) {
                const playerExists = team.memmber.some(member => member.id === player.id);
                if (!playerExists) {
                    team.memmber.push(player);
                }
            }
        },

        removePlayerFromTeam: (state, action) => {
            const { teamId, playerId } = action.payload;
            const team = state.teams.find(team => team.id === teamId);
            if (team) {
                team.memmber = team.memmber.filter(member => member.id !== playerId);
            }
        }
    }
});

export const { addTeam, removeALl, addPlayerToTeam, removePlayerFromTeam } = teamSlice.actions;
export default teamSlice.reducer;
