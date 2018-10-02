import { TypedAction } from '../models/typed-action';
import { INITIAL_SWEEPS_STATE, SweepsState, SweepsMode } from './sweeps.state';
import { SweepsActions } from './sweeps.actions';
import { user_sweep } from '../../../../shared/classes';
import { HashedArray } from '../../models/hashed-array.class';
import { SocialMedia } from '../../../../shared/models/social-media.enum';

export function sweepsReducer(state: SweepsState = INITIAL_SWEEPS_STATE, action: TypedAction<any>) {
    switch (action.type) {
        case SweepsActions.UPDATE_FILTER: {
            return {
                ...state,
                isSweepsLoading: true,
                filter: action.payload.search.nameSearch
            };
        }
        case SweepsActions.UPDATE_FILTER_COMPLETED: {
            return {
                ...state,
                isSweepsLoading: false,
                sweeps: new HashedArray<user_sweep>(action.payload, 'user_sweep_id')
            };
        }
        case SweepsActions.GO_TO_SWEEPS: {
            const isNewList = state.mode !== action.payload || state.filter !== INITIAL_SWEEPS_STATE.filter;
            const sweeps = isNewList ? new HashedArray<user_sweep>([], 'user_sweep_id') : state.sweeps;
            return {
                ...state,
                sweeps,
                filter: INITIAL_SWEEPS_STATE.filter,
                mode: action.payload
            };
        }
        case SweepsActions.GET_SWEEPS: {
            return {
                ...state,
                isSweepsLoading: true
            };
        }
        case SweepsActions.GET_SWEEPS_COMPLETED: {
            const newSweeps: user_sweep[] = action.payload;
            return {
                ...state,
                sweeps: state.sweeps.addItems(newSweeps),
                isSweepsLoading: false,
                isAllSweepsLoaded: newSweeps.length === 0
            };
        }
        case SweepsActions.ADD_SWEEP: {
            return {
                ...state,
                isSweepsLoading: true
            };
        }
        case SweepsActions.ADD_SWEEP_COMPLETED: {
            const sweep: user_sweep = action.payload;
            let sweeps = state.sweeps;
            switch (state.mode) {
                case SweepsMode.active: {
                    if (!sweep.is_referral && !sweep.is_frequency) {
                        sweeps = sweeps.addItem(sweep, sort);
                    }
                    break;
                }
                case SweepsMode.today: {
                    if (sweep.is_referral) {
                        sweeps = sweeps.addItem(sweep, sort);
                    }
                    break;
                }
                case SweepsMode.tomorrow: {
                    if (sweep.is_frequency && sweep.frequency_days === 1) {
                        sweeps = sweeps.addItem(sweep, sort);
                    }
                    break;
                }
                case SweepsMode.later: {
                    if (sweep.is_frequency && sweep.frequency_days > 1) {
                        sweeps = sweeps.addItem(sweep, sort);
                    }
                    break;
                }
                default: {
                    break;
                }
            }
            return {
                ...state,
                sweeps,
                isSweepsLoading: false
            };
        }
        case SweepsActions.SHARE_SWEEP_COMPLETED: {
            const sweep = state.sweeps.getItem(action.payload.sweep_id);

            if (!sweep) {
                return state;
            }

            switch (action.payload.social_media) {
                case SocialMedia.Twitter: {
                    sweep.last_twitter_share = new Date();
                    break;
                }
                case SocialMedia.Linkedin: {
                    sweep.last_linkedin_share = new Date();
                    break;
                }
                case SocialMedia.Pinterest: {
                    sweep.last_pinterest_share = new Date();
                    break;
                }
                case SocialMedia.Google: {
                    sweep.last_google_share = new Date();
                    break;
                }
                case SocialMedia.Facebook: {
                    sweep.last_facebook_share = new Date();
                    break;
                }
            }

            return {
                ...state,
                sweeps: state.sweeps.updateItem(sweep)
            };
        }
        case SweepsActions.ENTER_SWEEP_COMPLETED: {
            const old = state.sweeps.getItem(action.payload);
            if (old) {
                const updated = {
                    ...old,
                    last_entry_date: new Date(),
                    total_entries: old.total_entries ? old.total_entries + 1 : 1
                };
                return {
                    ...state,
                    sweeps: state.sweeps.updateItem(updated)
                };
            } else {
                return state;
            }
        }
        case SweepsActions.DELETE_SWEEP_COMPLETED: {
            return {
                ...state,
                sweeps: state.sweeps.deleteItem(action.payload.user_sweep_id)
            };
        }
        case SweepsActions.UPDATE_SWEEP_COMPLETED: {
            return {
                ...state,
                sweeps: state.sweeps.updateItem(action.payload)
            };
        }
        case SweepsActions.WIN_OR_UNWIN_SWEEP_COMPLETED: {
            return {
                ...state,
                sweeps: state.sweeps.updateItem(action.payload)
            };
        }
        case SweepsActions.REMOVE_SWEEP_FROM_LIST: {
            return {
                ...state,
                sweeps: state.sweeps.deleteItem(action.payload)
            };
        }
        default:
            return state;
    }
}

function sort(a: user_sweep, b: user_sweep) {
// -1 is a before b
    const aNextVisit = a.frequency_days * 864e5 - (Date.now() - a.last_entry_date.getTime());
    const bNextVisit = b.frequency_days * 864e5 - (Date.now() - b.last_entry_date.getTime());
    if (!a.deleted_yn && b.deleted_yn) {
        return -1;
    } else if (a.deleted_yn && !b.deleted_yn) {
        return 1;
    } else if (a.end_date.getTime() > b.end_date.getTime()) {
        return 1;
    } else if (a.end_date.getTime() < b.end_date.getTime()) {
        return -1;
    } else if (aNextVisit < bNextVisit) {
        return -1;
    } else if (aNextVisit > bNextVisit) {
        return 1;
    }
    return a.user_sweep_id > b.user_sweep_id ? -1 : 1;
}
