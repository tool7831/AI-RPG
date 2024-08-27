import { create } from 'zustand';
import { persist } from 'zustand/middleware'
import { Player } from './scripts/player.ts'

const useStore = create(persist(
    set => ({
        player: {},
        initPlayer: (data) => set({ player: new Player(data.name, data.description, data.status) })
    }),
    {
        name: 'player',
        storage: {
            getItem: (name) => {
                const str = localStorage.getItem(name);
                if (!str) return null;
                const { state } = JSON.parse(str);
                return {
                    state: {
                        player: Player.fromJSON({ name: state.player.name, description: state.player.description, status: state.player.status.status }),
                    }
                };
            }
        },
    }
))

export default useStore