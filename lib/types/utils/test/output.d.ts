import { Config, List, Value, Variants } from "../../config/mod.js";
export declare const enable: Value<{
    type: "boolean";
} & {
    name: string;
    default: true;
    description: string;
    warning: null;
}>;
export declare const username: Value<import("../../types/config-types.js").ValueSpecString>;
export declare const password: Value<import("../../types/config-types.js").ValueSpecString>;
export declare const authorizationList: List<import("../../types/config-types.js").ValueSpecListOf<"string">>;
export declare const auth: Value<import("../../types/config-types.js").ValueSpecList>;
export declare const serialversion: Value<{
    type: "enum";
} & {
    name: string;
    description: string;
    warning: null;
    default: string;
    values: string[];
    "value-names": {};
}>;
export declare const servertimeout: Value<import("../../types/config-types.js").ValueSpecNumber>;
export declare const threads: Value<import("../../types/config-types.js").ValueSpecNumber>;
export declare const workqueue: Value<import("../../types/config-types.js").ValueSpecNumber>;
export declare const advancedSpec: Config<{
    auth: import("../../types/config-types.js").ValueSpecList;
    serialversion: {
        type: "enum";
    } & {
        name: string;
        description: string;
        warning: null;
        default: string;
        values: string[];
        "value-names": {};
    };
    servertimeout: import("../../types/config-types.js").ValueSpecNumber;
    threads: import("../../types/config-types.js").ValueSpecNumber;
    workqueue: import("../../types/config-types.js").ValueSpecNumber;
}>;
export declare const advanced: Value<{
    type: "object";
} & Omit<{
    name: string;
    description: string;
    warning: null;
    default: null;
    "display-as": null;
    "unique-by": null;
    spec: Config<{
        auth: import("../../types/config-types.js").ValueSpecList;
        serialversion: {
            type: "enum";
        } & {
            name: string;
            description: string;
            warning: null;
            default: string;
            values: string[];
            "value-names": {};
        };
        servertimeout: import("../../types/config-types.js").ValueSpecNumber;
        threads: import("../../types/config-types.js").ValueSpecNumber;
        workqueue: import("../../types/config-types.js").ValueSpecNumber;
    }>;
    "value-names": {};
}, "spec"> & {
    spec: {
        auth: import("../../types/config-types.js").ValueSpecList;
        serialversion: {
            type: "enum";
        } & {
            name: string;
            description: string;
            warning: null;
            default: string;
            values: string[];
            "value-names": {};
        };
        servertimeout: import("../../types/config-types.js").ValueSpecNumber;
        threads: import("../../types/config-types.js").ValueSpecNumber;
        workqueue: import("../../types/config-types.js").ValueSpecNumber;
    };
}>;
export declare const rpcSettingsSpec: Config<{
    enable: {
        type: "boolean";
    } & {
        name: string;
        default: true;
        description: string;
        warning: null;
    };
    username: import("../../types/config-types.js").ValueSpecString;
    password: import("../../types/config-types.js").ValueSpecString;
    advanced: {
        type: "object";
    } & Omit<{
        name: string;
        description: string;
        warning: null;
        default: null;
        "display-as": null;
        "unique-by": null;
        spec: Config<{
            auth: import("../../types/config-types.js").ValueSpecList;
            serialversion: {
                type: "enum";
            } & {
                name: string;
                description: string;
                warning: null;
                default: string;
                values: string[];
                "value-names": {};
            };
            servertimeout: import("../../types/config-types.js").ValueSpecNumber;
            threads: import("../../types/config-types.js").ValueSpecNumber;
            workqueue: import("../../types/config-types.js").ValueSpecNumber;
        }>;
        "value-names": {};
    }, "spec"> & {
        spec: {
            auth: import("../../types/config-types.js").ValueSpecList;
            serialversion: {
                type: "enum";
            } & {
                name: string;
                description: string;
                warning: null;
                default: string;
                values: string[];
                "value-names": {};
            };
            servertimeout: import("../../types/config-types.js").ValueSpecNumber;
            threads: import("../../types/config-types.js").ValueSpecNumber;
            workqueue: import("../../types/config-types.js").ValueSpecNumber;
        };
    };
}>;
export declare const rpc: Value<{
    type: "object";
} & Omit<{
    name: string;
    description: string;
    warning: null;
    default: null;
    "display-as": null;
    "unique-by": null;
    spec: Config<{
        enable: {
            type: "boolean";
        } & {
            name: string;
            default: true;
            description: string;
            warning: null;
        };
        username: import("../../types/config-types.js").ValueSpecString;
        password: import("../../types/config-types.js").ValueSpecString;
        advanced: {
            type: "object";
        } & Omit<{
            name: string;
            description: string;
            warning: null;
            default: null;
            "display-as": null;
            "unique-by": null;
            spec: Config<{
                auth: import("../../types/config-types.js").ValueSpecList;
                serialversion: {
                    type: "enum";
                } & {
                    name: string;
                    description: string;
                    warning: null;
                    default: string;
                    values: string[];
                    "value-names": {};
                };
                servertimeout: import("../../types/config-types.js").ValueSpecNumber;
                threads: import("../../types/config-types.js").ValueSpecNumber;
                workqueue: import("../../types/config-types.js").ValueSpecNumber;
            }>;
            "value-names": {};
        }, "spec"> & {
            spec: {
                auth: import("../../types/config-types.js").ValueSpecList;
                serialversion: {
                    type: "enum";
                } & {
                    name: string;
                    description: string;
                    warning: null;
                    default: string;
                    values: string[];
                    "value-names": {};
                };
                servertimeout: import("../../types/config-types.js").ValueSpecNumber;
                threads: import("../../types/config-types.js").ValueSpecNumber;
                workqueue: import("../../types/config-types.js").ValueSpecNumber;
            };
        };
    }>;
    "value-names": {};
}, "spec"> & {
    spec: {
        enable: {
            type: "boolean";
        } & {
            name: string;
            default: true;
            description: string;
            warning: null;
        };
        username: import("../../types/config-types.js").ValueSpecString;
        password: import("../../types/config-types.js").ValueSpecString;
        advanced: {
            type: "object";
        } & Omit<{
            name: string;
            description: string;
            warning: null;
            default: null;
            "display-as": null;
            "unique-by": null;
            spec: Config<{
                auth: import("../../types/config-types.js").ValueSpecList;
                serialversion: {
                    type: "enum";
                } & {
                    name: string;
                    description: string;
                    warning: null;
                    default: string;
                    values: string[];
                    "value-names": {};
                };
                servertimeout: import("../../types/config-types.js").ValueSpecNumber;
                threads: import("../../types/config-types.js").ValueSpecNumber;
                workqueue: import("../../types/config-types.js").ValueSpecNumber;
            }>;
            "value-names": {};
        }, "spec"> & {
            spec: {
                auth: import("../../types/config-types.js").ValueSpecList;
                serialversion: {
                    type: "enum";
                } & {
                    name: string;
                    description: string;
                    warning: null;
                    default: string;
                    values: string[];
                    "value-names": {};
                };
                servertimeout: import("../../types/config-types.js").ValueSpecNumber;
                threads: import("../../types/config-types.js").ValueSpecNumber;
                workqueue: import("../../types/config-types.js").ValueSpecNumber;
            };
        };
    };
}>;
export declare const zmqEnabled: Value<{
    type: "boolean";
} & {
    name: string;
    default: true;
    description: string;
    warning: null;
}>;
export declare const txindex: Value<{
    type: "boolean";
} & {
    name: string;
    default: true;
    description: string;
    warning: null;
}>;
export declare const enable1: Value<{
    type: "boolean";
} & {
    name: string;
    default: true;
    description: string;
    warning: null;
}>;
export declare const avoidpartialspends: Value<{
    type: "boolean";
} & {
    name: string;
    default: true;
    description: string;
    warning: null;
}>;
export declare const discardfee: Value<import("../../types/config-types.js").ValueSpecNumber>;
export declare const walletSpec: Config<{
    enable: {
        type: "boolean";
    } & {
        name: string;
        default: true;
        description: string;
        warning: null;
    };
    avoidpartialspends: {
        type: "boolean";
    } & {
        name: string;
        default: true;
        description: string;
        warning: null;
    };
    discardfee: import("../../types/config-types.js").ValueSpecNumber;
}>;
export declare const wallet: Value<{
    type: "object";
} & Omit<{
    name: string;
    description: string;
    warning: null;
    default: null;
    "display-as": null;
    "unique-by": null;
    spec: Config<{
        enable: {
            type: "boolean";
        } & {
            name: string;
            default: true;
            description: string;
            warning: null;
        };
        avoidpartialspends: {
            type: "boolean";
        } & {
            name: string;
            default: true;
            description: string;
            warning: null;
        };
        discardfee: import("../../types/config-types.js").ValueSpecNumber;
    }>;
    "value-names": {};
}, "spec"> & {
    spec: {
        enable: {
            type: "boolean";
        } & {
            name: string;
            default: true;
            description: string;
            warning: null;
        };
        avoidpartialspends: {
            type: "boolean";
        } & {
            name: string;
            default: true;
            description: string;
            warning: null;
        };
        discardfee: import("../../types/config-types.js").ValueSpecNumber;
    };
}>;
export declare const mempoolfullrbf: Value<{
    type: "boolean";
} & {
    name: string;
    default: false;
    description: string;
    warning: null;
}>;
export declare const persistmempool: Value<{
    type: "boolean";
} & {
    name: string;
    default: true;
    description: string;
    warning: null;
}>;
export declare const maxmempool: Value<import("../../types/config-types.js").ValueSpecNumber>;
export declare const mempoolexpiry: Value<import("../../types/config-types.js").ValueSpecNumber>;
export declare const mempoolSpec: Config<{
    mempoolfullrbf: {
        type: "boolean";
    } & {
        name: string;
        default: false;
        description: string;
        warning: null;
    };
    persistmempool: {
        type: "boolean";
    } & {
        name: string;
        default: true;
        description: string;
        warning: null;
    };
    maxmempool: import("../../types/config-types.js").ValueSpecNumber;
    mempoolexpiry: import("../../types/config-types.js").ValueSpecNumber;
}>;
export declare const mempool: Value<{
    type: "object";
} & Omit<{
    name: string;
    description: string;
    warning: null;
    default: null;
    "display-as": null;
    "unique-by": null;
    spec: Config<{
        mempoolfullrbf: {
            type: "boolean";
        } & {
            name: string;
            default: false;
            description: string;
            warning: null;
        };
        persistmempool: {
            type: "boolean";
        } & {
            name: string;
            default: true;
            description: string;
            warning: null;
        };
        maxmempool: import("../../types/config-types.js").ValueSpecNumber;
        mempoolexpiry: import("../../types/config-types.js").ValueSpecNumber;
    }>;
    "value-names": {};
}, "spec"> & {
    spec: {
        mempoolfullrbf: {
            type: "boolean";
        } & {
            name: string;
            default: false;
            description: string;
            warning: null;
        };
        persistmempool: {
            type: "boolean";
        } & {
            name: string;
            default: true;
            description: string;
            warning: null;
        };
        maxmempool: import("../../types/config-types.js").ValueSpecNumber;
        mempoolexpiry: import("../../types/config-types.js").ValueSpecNumber;
    };
}>;
export declare const listen: Value<{
    type: "boolean";
} & {
    name: string;
    default: true;
    description: string;
    warning: null;
}>;
export declare const onlyconnect: Value<{
    type: "boolean";
} & {
    name: string;
    default: false;
    description: string;
    warning: null;
}>;
export declare const onlyonion: Value<{
    type: "boolean";
} & {
    name: string;
    default: false;
    description: string;
    warning: null;
}>;
export declare const hostname: Value<import("../../types/config-types.js").ValueSpecString>;
export declare const port: Value<import("../../types/config-types.js").ValueSpecNumber>;
export declare const addNodesSpec: Config<{
    hostname: import("../../types/config-types.js").ValueSpecString;
    port: import("../../types/config-types.js").ValueSpecNumber;
}>;
export declare const addNodesList: List<{
    type: "list";
    subtype: "object";
} & {
    spec: {
        spec: {
            hostname: import("../../types/config-types.js").ValueSpecString;
            port: import("../../types/config-types.js").ValueSpecNumber;
        };
        "display-as": string | null;
        "unique-by": import("../../types/config-types.js").UniqueBy;
    };
} & Omit<{
    name: string;
    range: string;
    spec: {
        spec: Config<{
            hostname: import("../../types/config-types.js").ValueSpecString;
            port: import("../../types/config-types.js").ValueSpecNumber;
        }>;
        "display-as": null;
        "unique-by": null;
    };
    default: never[];
    description: string;
    warning: null;
}, "spec">>;
export declare const addnode: Value<import("../../types/config-types.js").ValueSpecList>;
export declare const peersSpec: Config<{
    listen: {
        type: "boolean";
    } & {
        name: string;
        default: true;
        description: string;
        warning: null;
    };
    onlyconnect: {
        type: "boolean";
    } & {
        name: string;
        default: false;
        description: string;
        warning: null;
    };
    onlyonion: {
        type: "boolean";
    } & {
        name: string;
        default: false;
        description: string;
        warning: null;
    };
    addnode: import("../../types/config-types.js").ValueSpecList;
}>;
export declare const peers: Value<{
    type: "object";
} & Omit<{
    name: string;
    description: string;
    warning: null;
    default: null;
    "display-as": null;
    "unique-by": null;
    spec: Config<{
        listen: {
            type: "boolean";
        } & {
            name: string;
            default: true;
            description: string;
            warning: null;
        };
        onlyconnect: {
            type: "boolean";
        } & {
            name: string;
            default: false;
            description: string;
            warning: null;
        };
        onlyonion: {
            type: "boolean";
        } & {
            name: string;
            default: false;
            description: string;
            warning: null;
        };
        addnode: import("../../types/config-types.js").ValueSpecList;
    }>;
    "value-names": {};
}, "spec"> & {
    spec: {
        listen: {
            type: "boolean";
        } & {
            name: string;
            default: true;
            description: string;
            warning: null;
        };
        onlyconnect: {
            type: "boolean";
        } & {
            name: string;
            default: false;
            description: string;
            warning: null;
        };
        onlyonion: {
            type: "boolean";
        } & {
            name: string;
            default: false;
            description: string;
            warning: null;
        };
        addnode: import("../../types/config-types.js").ValueSpecList;
    };
}>;
export declare const dbcache: Value<import("../../types/config-types.js").ValueSpecNumber>;
export declare const disabled: Config<{}>;
export declare const size: Value<import("../../types/config-types.js").ValueSpecNumber>;
export declare const automatic: Config<{
    size: import("../../types/config-types.js").ValueSpecNumber;
}>;
export declare const size1: Value<import("../../types/config-types.js").ValueSpecNumber>;
export declare const manual: Config<{
    size: import("../../types/config-types.js").ValueSpecNumber;
}>;
export declare const pruningSettingsVariants: Variants<{
    disabled: {};
    automatic: {
        size: import("../../types/config-types.js").ValueSpecNumber;
    };
    manual: {
        size: import("../../types/config-types.js").ValueSpecNumber;
    };
}>;
export declare const pruning: Value<{
    type: "union";
} & Omit<{
    name: string;
    description: string;
    warning: string;
    default: string;
    variants: Variants<{
        disabled: {};
        automatic: {
            size: import("../../types/config-types.js").ValueSpecNumber;
        };
        manual: {
            size: import("../../types/config-types.js").ValueSpecNumber;
        };
    }>;
    tag: {
        id: "mode";
        name: string;
        description: string;
        warning: null;
        "variant-names": {
            disabled: string;
            automatic: string;
            manual: string;
        };
    };
    "display-as": null;
    "unique-by": null;
    "variant-names": null;
}, "variants"> & {
    variants: {
        disabled: {};
        automatic: {
            size: import("../../types/config-types.js").ValueSpecNumber;
        };
        manual: {
            size: import("../../types/config-types.js").ValueSpecNumber;
        };
    };
}>;
export declare const blockfilterindex: Value<{
    type: "boolean";
} & {
    name: string;
    default: true;
    description: string;
    warning: null;
}>;
export declare const peerblockfilters: Value<{
    type: "boolean";
} & {
    name: string;
    default: false;
    description: string;
    warning: null;
}>;
export declare const blockFiltersSpec: Config<{
    blockfilterindex: {
        type: "boolean";
    } & {
        name: string;
        default: true;
        description: string;
        warning: null;
    };
    peerblockfilters: {
        type: "boolean";
    } & {
        name: string;
        default: false;
        description: string;
        warning: null;
    };
}>;
export declare const blockfilters: Value<{
    type: "object";
} & Omit<{
    name: string;
    description: string;
    warning: null;
    default: null;
    "display-as": null;
    "unique-by": null;
    spec: Config<{
        blockfilterindex: {
            type: "boolean";
        } & {
            name: string;
            default: true;
            description: string;
            warning: null;
        };
        peerblockfilters: {
            type: "boolean";
        } & {
            name: string;
            default: false;
            description: string;
            warning: null;
        };
    }>;
    "value-names": {};
}, "spec"> & {
    spec: {
        blockfilterindex: {
            type: "boolean";
        } & {
            name: string;
            default: true;
            description: string;
            warning: null;
        };
        peerblockfilters: {
            type: "boolean";
        } & {
            name: string;
            default: false;
            description: string;
            warning: null;
        };
    };
}>;
export declare const peerbloomfilters: Value<{
    type: "boolean";
} & {
    name: string;
    default: false;
    description: string;
    warning: string;
}>;
export declare const bloomFiltersBip37Spec: Config<{
    peerbloomfilters: {
        type: "boolean";
    } & {
        name: string;
        default: false;
        description: string;
        warning: string;
    };
}>;
export declare const bloomfilters: Value<{
    type: "object";
} & Omit<{
    name: string;
    description: string;
    warning: null;
    default: null;
    "display-as": null;
    "unique-by": null;
    spec: Config<{
        peerbloomfilters: {
            type: "boolean";
        } & {
            name: string;
            default: false;
            description: string;
            warning: string;
        };
    }>;
    "value-names": {};
}, "spec"> & {
    spec: {
        peerbloomfilters: {
            type: "boolean";
        } & {
            name: string;
            default: false;
            description: string;
            warning: string;
        };
    };
}>;
export declare const advancedSpec1: Config<{
    mempool: {
        type: "object";
    } & Omit<{
        name: string;
        description: string;
        warning: null;
        default: null;
        "display-as": null;
        "unique-by": null;
        spec: Config<{
            mempoolfullrbf: {
                type: "boolean";
            } & {
                name: string;
                default: false;
                description: string;
                warning: null;
            };
            persistmempool: {
                type: "boolean";
            } & {
                name: string;
                default: true;
                description: string;
                warning: null;
            };
            maxmempool: import("../../types/config-types.js").ValueSpecNumber;
            mempoolexpiry: import("../../types/config-types.js").ValueSpecNumber;
        }>;
        "value-names": {};
    }, "spec"> & {
        spec: {
            mempoolfullrbf: {
                type: "boolean";
            } & {
                name: string;
                default: false;
                description: string;
                warning: null;
            };
            persistmempool: {
                type: "boolean";
            } & {
                name: string;
                default: true;
                description: string;
                warning: null;
            };
            maxmempool: import("../../types/config-types.js").ValueSpecNumber;
            mempoolexpiry: import("../../types/config-types.js").ValueSpecNumber;
        };
    };
    peers: {
        type: "object";
    } & Omit<{
        name: string;
        description: string;
        warning: null;
        default: null;
        "display-as": null;
        "unique-by": null;
        spec: Config<{
            listen: {
                type: "boolean";
            } & {
                name: string;
                default: true;
                description: string;
                warning: null;
            };
            onlyconnect: {
                type: "boolean";
            } & {
                name: string;
                default: false;
                description: string;
                warning: null;
            };
            onlyonion: {
                type: "boolean";
            } & {
                name: string;
                default: false;
                description: string;
                warning: null;
            };
            addnode: import("../../types/config-types.js").ValueSpecList;
        }>;
        "value-names": {};
    }, "spec"> & {
        spec: {
            listen: {
                type: "boolean";
            } & {
                name: string;
                default: true;
                description: string;
                warning: null;
            };
            onlyconnect: {
                type: "boolean";
            } & {
                name: string;
                default: false;
                description: string;
                warning: null;
            };
            onlyonion: {
                type: "boolean";
            } & {
                name: string;
                default: false;
                description: string;
                warning: null;
            };
            addnode: import("../../types/config-types.js").ValueSpecList;
        };
    };
    dbcache: import("../../types/config-types.js").ValueSpecNumber;
    pruning: {
        type: "union";
    } & Omit<{
        name: string;
        description: string;
        warning: string;
        default: string;
        variants: Variants<{
            disabled: {};
            automatic: {
                size: import("../../types/config-types.js").ValueSpecNumber;
            };
            manual: {
                size: import("../../types/config-types.js").ValueSpecNumber;
            };
        }>;
        tag: {
            id: "mode";
            name: string;
            description: string;
            warning: null;
            "variant-names": {
                disabled: string;
                automatic: string;
                manual: string;
            };
        };
        "display-as": null;
        "unique-by": null;
        "variant-names": null;
    }, "variants"> & {
        variants: {
            disabled: {};
            automatic: {
                size: import("../../types/config-types.js").ValueSpecNumber;
            };
            manual: {
                size: import("../../types/config-types.js").ValueSpecNumber;
            };
        };
    };
    blockfilters: {
        type: "object";
    } & Omit<{
        name: string;
        description: string;
        warning: null;
        default: null;
        "display-as": null;
        "unique-by": null;
        spec: Config<{
            blockfilterindex: {
                type: "boolean";
            } & {
                name: string;
                default: true;
                description: string;
                warning: null;
            };
            peerblockfilters: {
                type: "boolean";
            } & {
                name: string;
                default: false;
                description: string;
                warning: null;
            };
        }>;
        "value-names": {};
    }, "spec"> & {
        spec: {
            blockfilterindex: {
                type: "boolean";
            } & {
                name: string;
                default: true;
                description: string;
                warning: null;
            };
            peerblockfilters: {
                type: "boolean";
            } & {
                name: string;
                default: false;
                description: string;
                warning: null;
            };
        };
    };
    bloomfilters: {
        type: "object";
    } & Omit<{
        name: string;
        description: string;
        warning: null;
        default: null;
        "display-as": null;
        "unique-by": null;
        spec: Config<{
            peerbloomfilters: {
                type: "boolean";
            } & {
                name: string;
                default: false;
                description: string;
                warning: string;
            };
        }>;
        "value-names": {};
    }, "spec"> & {
        spec: {
            peerbloomfilters: {
                type: "boolean";
            } & {
                name: string;
                default: false;
                description: string;
                warning: string;
            };
        };
    };
}>;
export declare const advanced1: Value<{
    type: "object";
} & Omit<{
    name: string;
    description: string;
    warning: null;
    default: null;
    "display-as": null;
    "unique-by": null;
    spec: Config<{
        mempool: {
            type: "object";
        } & Omit<{
            name: string;
            description: string;
            warning: null;
            default: null;
            "display-as": null;
            "unique-by": null;
            spec: Config<{
                mempoolfullrbf: {
                    type: "boolean";
                } & {
                    name: string;
                    default: false;
                    description: string;
                    warning: null;
                };
                persistmempool: {
                    type: "boolean";
                } & {
                    name: string;
                    default: true;
                    description: string;
                    warning: null;
                };
                maxmempool: import("../../types/config-types.js").ValueSpecNumber;
                mempoolexpiry: import("../../types/config-types.js").ValueSpecNumber;
            }>;
            "value-names": {};
        }, "spec"> & {
            spec: {
                mempoolfullrbf: {
                    type: "boolean";
                } & {
                    name: string;
                    default: false;
                    description: string;
                    warning: null;
                };
                persistmempool: {
                    type: "boolean";
                } & {
                    name: string;
                    default: true;
                    description: string;
                    warning: null;
                };
                maxmempool: import("../../types/config-types.js").ValueSpecNumber;
                mempoolexpiry: import("../../types/config-types.js").ValueSpecNumber;
            };
        };
        peers: {
            type: "object";
        } & Omit<{
            name: string;
            description: string;
            warning: null;
            default: null;
            "display-as": null;
            "unique-by": null;
            spec: Config<{
                listen: {
                    type: "boolean";
                } & {
                    name: string;
                    default: true;
                    description: string;
                    warning: null;
                };
                onlyconnect: {
                    type: "boolean";
                } & {
                    name: string;
                    default: false;
                    description: string;
                    warning: null;
                };
                onlyonion: {
                    type: "boolean";
                } & {
                    name: string;
                    default: false;
                    description: string;
                    warning: null;
                };
                addnode: import("../../types/config-types.js").ValueSpecList;
            }>;
            "value-names": {};
        }, "spec"> & {
            spec: {
                listen: {
                    type: "boolean";
                } & {
                    name: string;
                    default: true;
                    description: string;
                    warning: null;
                };
                onlyconnect: {
                    type: "boolean";
                } & {
                    name: string;
                    default: false;
                    description: string;
                    warning: null;
                };
                onlyonion: {
                    type: "boolean";
                } & {
                    name: string;
                    default: false;
                    description: string;
                    warning: null;
                };
                addnode: import("../../types/config-types.js").ValueSpecList;
            };
        };
        dbcache: import("../../types/config-types.js").ValueSpecNumber;
        pruning: {
            type: "union";
        } & Omit<{
            name: string;
            description: string;
            warning: string;
            default: string;
            variants: Variants<{
                disabled: {};
                automatic: {
                    size: import("../../types/config-types.js").ValueSpecNumber;
                };
                manual: {
                    size: import("../../types/config-types.js").ValueSpecNumber;
                };
            }>;
            tag: {
                id: "mode";
                name: string;
                description: string;
                warning: null;
                "variant-names": {
                    disabled: string;
                    automatic: string;
                    manual: string;
                };
            };
            "display-as": null;
            "unique-by": null;
            "variant-names": null;
        }, "variants"> & {
            variants: {
                disabled: {};
                automatic: {
                    size: import("../../types/config-types.js").ValueSpecNumber;
                };
                manual: {
                    size: import("../../types/config-types.js").ValueSpecNumber;
                };
            };
        };
        blockfilters: {
            type: "object";
        } & Omit<{
            name: string;
            description: string;
            warning: null;
            default: null;
            "display-as": null;
            "unique-by": null;
            spec: Config<{
                blockfilterindex: {
                    type: "boolean";
                } & {
                    name: string;
                    default: true;
                    description: string;
                    warning: null;
                };
                peerblockfilters: {
                    type: "boolean";
                } & {
                    name: string;
                    default: false;
                    description: string;
                    warning: null;
                };
            }>;
            "value-names": {};
        }, "spec"> & {
            spec: {
                blockfilterindex: {
                    type: "boolean";
                } & {
                    name: string;
                    default: true;
                    description: string;
                    warning: null;
                };
                peerblockfilters: {
                    type: "boolean";
                } & {
                    name: string;
                    default: false;
                    description: string;
                    warning: null;
                };
            };
        };
        bloomfilters: {
            type: "object";
        } & Omit<{
            name: string;
            description: string;
            warning: null;
            default: null;
            "display-as": null;
            "unique-by": null;
            spec: Config<{
                peerbloomfilters: {
                    type: "boolean";
                } & {
                    name: string;
                    default: false;
                    description: string;
                    warning: string;
                };
            }>;
            "value-names": {};
        }, "spec"> & {
            spec: {
                peerbloomfilters: {
                    type: "boolean";
                } & {
                    name: string;
                    default: false;
                    description: string;
                    warning: string;
                };
            };
        };
    }>;
    "value-names": {};
}, "spec"> & {
    spec: {
        mempool: {
            type: "object";
        } & Omit<{
            name: string;
            description: string;
            warning: null;
            default: null;
            "display-as": null;
            "unique-by": null;
            spec: Config<{
                mempoolfullrbf: {
                    type: "boolean";
                } & {
                    name: string;
                    default: false;
                    description: string;
                    warning: null;
                };
                persistmempool: {
                    type: "boolean";
                } & {
                    name: string;
                    default: true;
                    description: string;
                    warning: null;
                };
                maxmempool: import("../../types/config-types.js").ValueSpecNumber;
                mempoolexpiry: import("../../types/config-types.js").ValueSpecNumber;
            }>;
            "value-names": {};
        }, "spec"> & {
            spec: {
                mempoolfullrbf: {
                    type: "boolean";
                } & {
                    name: string;
                    default: false;
                    description: string;
                    warning: null;
                };
                persistmempool: {
                    type: "boolean";
                } & {
                    name: string;
                    default: true;
                    description: string;
                    warning: null;
                };
                maxmempool: import("../../types/config-types.js").ValueSpecNumber;
                mempoolexpiry: import("../../types/config-types.js").ValueSpecNumber;
            };
        };
        peers: {
            type: "object";
        } & Omit<{
            name: string;
            description: string;
            warning: null;
            default: null;
            "display-as": null;
            "unique-by": null;
            spec: Config<{
                listen: {
                    type: "boolean";
                } & {
                    name: string;
                    default: true;
                    description: string;
                    warning: null;
                };
                onlyconnect: {
                    type: "boolean";
                } & {
                    name: string;
                    default: false;
                    description: string;
                    warning: null;
                };
                onlyonion: {
                    type: "boolean";
                } & {
                    name: string;
                    default: false;
                    description: string;
                    warning: null;
                };
                addnode: import("../../types/config-types.js").ValueSpecList;
            }>;
            "value-names": {};
        }, "spec"> & {
            spec: {
                listen: {
                    type: "boolean";
                } & {
                    name: string;
                    default: true;
                    description: string;
                    warning: null;
                };
                onlyconnect: {
                    type: "boolean";
                } & {
                    name: string;
                    default: false;
                    description: string;
                    warning: null;
                };
                onlyonion: {
                    type: "boolean";
                } & {
                    name: string;
                    default: false;
                    description: string;
                    warning: null;
                };
                addnode: import("../../types/config-types.js").ValueSpecList;
            };
        };
        dbcache: import("../../types/config-types.js").ValueSpecNumber;
        pruning: {
            type: "union";
        } & Omit<{
            name: string;
            description: string;
            warning: string;
            default: string;
            variants: Variants<{
                disabled: {};
                automatic: {
                    size: import("../../types/config-types.js").ValueSpecNumber;
                };
                manual: {
                    size: import("../../types/config-types.js").ValueSpecNumber;
                };
            }>;
            tag: {
                id: "mode";
                name: string;
                description: string;
                warning: null;
                "variant-names": {
                    disabled: string;
                    automatic: string;
                    manual: string;
                };
            };
            "display-as": null;
            "unique-by": null;
            "variant-names": null;
        }, "variants"> & {
            variants: {
                disabled: {};
                automatic: {
                    size: import("../../types/config-types.js").ValueSpecNumber;
                };
                manual: {
                    size: import("../../types/config-types.js").ValueSpecNumber;
                };
            };
        };
        blockfilters: {
            type: "object";
        } & Omit<{
            name: string;
            description: string;
            warning: null;
            default: null;
            "display-as": null;
            "unique-by": null;
            spec: Config<{
                blockfilterindex: {
                    type: "boolean";
                } & {
                    name: string;
                    default: true;
                    description: string;
                    warning: null;
                };
                peerblockfilters: {
                    type: "boolean";
                } & {
                    name: string;
                    default: false;
                    description: string;
                    warning: null;
                };
            }>;
            "value-names": {};
        }, "spec"> & {
            spec: {
                blockfilterindex: {
                    type: "boolean";
                } & {
                    name: string;
                    default: true;
                    description: string;
                    warning: null;
                };
                peerblockfilters: {
                    type: "boolean";
                } & {
                    name: string;
                    default: false;
                    description: string;
                    warning: null;
                };
            };
        };
        bloomfilters: {
            type: "object";
        } & Omit<{
            name: string;
            description: string;
            warning: null;
            default: null;
            "display-as": null;
            "unique-by": null;
            spec: Config<{
                peerbloomfilters: {
                    type: "boolean";
                } & {
                    name: string;
                    default: false;
                    description: string;
                    warning: string;
                };
            }>;
            "value-names": {};
        }, "spec"> & {
            spec: {
                peerbloomfilters: {
                    type: "boolean";
                } & {
                    name: string;
                    default: false;
                    description: string;
                    warning: string;
                };
            };
        };
    };
}>;
export declare const config: Config<{
    rpc: {
        type: "object";
    } & Omit<{
        name: string;
        description: string;
        warning: null;
        default: null;
        "display-as": null;
        "unique-by": null;
        spec: Config<{
            enable: {
                type: "boolean";
            } & {
                name: string;
                default: true;
                description: string;
                warning: null;
            };
            username: import("../../types/config-types.js").ValueSpecString;
            password: import("../../types/config-types.js").ValueSpecString;
            advanced: {
                type: "object";
            } & Omit<{
                name: string;
                description: string;
                warning: null;
                default: null;
                "display-as": null;
                "unique-by": null;
                spec: Config<{
                    auth: import("../../types/config-types.js").ValueSpecList;
                    serialversion: {
                        type: "enum";
                    } & {
                        name: string;
                        description: string;
                        warning: null;
                        default: string;
                        values: string[];
                        "value-names": {};
                    };
                    servertimeout: import("../../types/config-types.js").ValueSpecNumber;
                    threads: import("../../types/config-types.js").ValueSpecNumber;
                    workqueue: import("../../types/config-types.js").ValueSpecNumber;
                }>;
                "value-names": {};
            }, "spec"> & {
                spec: {
                    auth: import("../../types/config-types.js").ValueSpecList;
                    serialversion: {
                        type: "enum";
                    } & {
                        name: string;
                        description: string;
                        warning: null;
                        default: string;
                        values: string[];
                        "value-names": {};
                    };
                    servertimeout: import("../../types/config-types.js").ValueSpecNumber;
                    threads: import("../../types/config-types.js").ValueSpecNumber;
                    workqueue: import("../../types/config-types.js").ValueSpecNumber;
                };
            };
        }>;
        "value-names": {};
    }, "spec"> & {
        spec: {
            enable: {
                type: "boolean";
            } & {
                name: string;
                default: true;
                description: string;
                warning: null;
            };
            username: import("../../types/config-types.js").ValueSpecString;
            password: import("../../types/config-types.js").ValueSpecString;
            advanced: {
                type: "object";
            } & Omit<{
                name: string;
                description: string;
                warning: null;
                default: null;
                "display-as": null;
                "unique-by": null;
                spec: Config<{
                    auth: import("../../types/config-types.js").ValueSpecList;
                    serialversion: {
                        type: "enum";
                    } & {
                        name: string;
                        description: string;
                        warning: null;
                        default: string;
                        values: string[];
                        "value-names": {};
                    };
                    servertimeout: import("../../types/config-types.js").ValueSpecNumber;
                    threads: import("../../types/config-types.js").ValueSpecNumber;
                    workqueue: import("../../types/config-types.js").ValueSpecNumber;
                }>;
                "value-names": {};
            }, "spec"> & {
                spec: {
                    auth: import("../../types/config-types.js").ValueSpecList;
                    serialversion: {
                        type: "enum";
                    } & {
                        name: string;
                        description: string;
                        warning: null;
                        default: string;
                        values: string[];
                        "value-names": {};
                    };
                    servertimeout: import("../../types/config-types.js").ValueSpecNumber;
                    threads: import("../../types/config-types.js").ValueSpecNumber;
                    workqueue: import("../../types/config-types.js").ValueSpecNumber;
                };
            };
        };
    };
    "zmq-enabled": {
        type: "boolean";
    } & {
        name: string;
        default: true;
        description: string;
        warning: null;
    };
    txindex: {
        type: "boolean";
    } & {
        name: string;
        default: true;
        description: string;
        warning: null;
    };
    wallet: {
        type: "object";
    } & Omit<{
        name: string;
        description: string;
        warning: null;
        default: null;
        "display-as": null;
        "unique-by": null;
        spec: Config<{
            enable: {
                type: "boolean";
            } & {
                name: string;
                default: true;
                description: string;
                warning: null;
            };
            avoidpartialspends: {
                type: "boolean";
            } & {
                name: string;
                default: true;
                description: string;
                warning: null;
            };
            discardfee: import("../../types/config-types.js").ValueSpecNumber;
        }>;
        "value-names": {};
    }, "spec"> & {
        spec: {
            enable: {
                type: "boolean";
            } & {
                name: string;
                default: true;
                description: string;
                warning: null;
            };
            avoidpartialspends: {
                type: "boolean";
            } & {
                name: string;
                default: true;
                description: string;
                warning: null;
            };
            discardfee: import("../../types/config-types.js").ValueSpecNumber;
        };
    };
    advanced: {
        type: "object";
    } & Omit<{
        name: string;
        description: string;
        warning: null;
        default: null;
        "display-as": null;
        "unique-by": null;
        spec: Config<{
            mempool: {
                type: "object";
            } & Omit<{
                name: string;
                description: string;
                warning: null;
                default: null;
                "display-as": null;
                "unique-by": null;
                spec: Config<{
                    mempoolfullrbf: {
                        type: "boolean";
                    } & {
                        name: string;
                        default: false;
                        description: string;
                        warning: null;
                    };
                    persistmempool: {
                        type: "boolean";
                    } & {
                        name: string;
                        default: true;
                        description: string;
                        warning: null;
                    };
                    maxmempool: import("../../types/config-types.js").ValueSpecNumber;
                    mempoolexpiry: import("../../types/config-types.js").ValueSpecNumber;
                }>;
                "value-names": {};
            }, "spec"> & {
                spec: {
                    mempoolfullrbf: {
                        type: "boolean";
                    } & {
                        name: string;
                        default: false;
                        description: string;
                        warning: null;
                    };
                    persistmempool: {
                        type: "boolean";
                    } & {
                        name: string;
                        default: true;
                        description: string;
                        warning: null;
                    };
                    maxmempool: import("../../types/config-types.js").ValueSpecNumber;
                    mempoolexpiry: import("../../types/config-types.js").ValueSpecNumber;
                };
            };
            peers: {
                type: "object";
            } & Omit<{
                name: string;
                description: string;
                warning: null;
                default: null;
                "display-as": null;
                "unique-by": null;
                spec: Config<{
                    listen: {
                        type: "boolean";
                    } & {
                        name: string;
                        default: true;
                        description: string;
                        warning: null;
                    };
                    onlyconnect: {
                        type: "boolean";
                    } & {
                        name: string;
                        default: false;
                        description: string;
                        warning: null;
                    };
                    onlyonion: {
                        type: "boolean";
                    } & {
                        name: string;
                        default: false;
                        description: string;
                        warning: null;
                    };
                    addnode: import("../../types/config-types.js").ValueSpecList;
                }>;
                "value-names": {};
            }, "spec"> & {
                spec: {
                    listen: {
                        type: "boolean";
                    } & {
                        name: string;
                        default: true;
                        description: string;
                        warning: null;
                    };
                    onlyconnect: {
                        type: "boolean";
                    } & {
                        name: string;
                        default: false;
                        description: string;
                        warning: null;
                    };
                    onlyonion: {
                        type: "boolean";
                    } & {
                        name: string;
                        default: false;
                        description: string;
                        warning: null;
                    };
                    addnode: import("../../types/config-types.js").ValueSpecList;
                };
            };
            dbcache: import("../../types/config-types.js").ValueSpecNumber;
            pruning: {
                type: "union";
            } & Omit<{
                name: string;
                description: string;
                warning: string;
                default: string;
                variants: Variants<{
                    disabled: {};
                    automatic: {
                        size: import("../../types/config-types.js").ValueSpecNumber;
                    };
                    manual: {
                        size: import("../../types/config-types.js").ValueSpecNumber;
                    };
                }>;
                tag: {
                    id: "mode";
                    name: string;
                    description: string;
                    warning: null;
                    "variant-names": {
                        disabled: string;
                        automatic: string;
                        manual: string;
                    };
                };
                "display-as": null;
                "unique-by": null;
                "variant-names": null;
            }, "variants"> & {
                variants: {
                    disabled: {};
                    automatic: {
                        size: import("../../types/config-types.js").ValueSpecNumber;
                    };
                    manual: {
                        size: import("../../types/config-types.js").ValueSpecNumber;
                    };
                };
            };
            blockfilters: {
                type: "object";
            } & Omit<{
                name: string;
                description: string;
                warning: null;
                default: null;
                "display-as": null;
                "unique-by": null;
                spec: Config<{
                    blockfilterindex: {
                        type: "boolean";
                    } & {
                        name: string;
                        default: true;
                        description: string;
                        warning: null;
                    };
                    peerblockfilters: {
                        type: "boolean";
                    } & {
                        name: string;
                        default: false;
                        description: string;
                        warning: null;
                    };
                }>;
                "value-names": {};
            }, "spec"> & {
                spec: {
                    blockfilterindex: {
                        type: "boolean";
                    } & {
                        name: string;
                        default: true;
                        description: string;
                        warning: null;
                    };
                    peerblockfilters: {
                        type: "boolean";
                    } & {
                        name: string;
                        default: false;
                        description: string;
                        warning: null;
                    };
                };
            };
            bloomfilters: {
                type: "object";
            } & Omit<{
                name: string;
                description: string;
                warning: null;
                default: null;
                "display-as": null;
                "unique-by": null;
                spec: Config<{
                    peerbloomfilters: {
                        type: "boolean";
                    } & {
                        name: string;
                        default: false;
                        description: string;
                        warning: string;
                    };
                }>;
                "value-names": {};
            }, "spec"> & {
                spec: {
                    peerbloomfilters: {
                        type: "boolean";
                    } & {
                        name: string;
                        default: false;
                        description: string;
                        warning: string;
                    };
                };
            };
        }>;
        "value-names": {};
    }, "spec"> & {
        spec: {
            mempool: {
                type: "object";
            } & Omit<{
                name: string;
                description: string;
                warning: null;
                default: null;
                "display-as": null;
                "unique-by": null;
                spec: Config<{
                    mempoolfullrbf: {
                        type: "boolean";
                    } & {
                        name: string;
                        default: false;
                        description: string;
                        warning: null;
                    };
                    persistmempool: {
                        type: "boolean";
                    } & {
                        name: string;
                        default: true;
                        description: string;
                        warning: null;
                    };
                    maxmempool: import("../../types/config-types.js").ValueSpecNumber;
                    mempoolexpiry: import("../../types/config-types.js").ValueSpecNumber;
                }>;
                "value-names": {};
            }, "spec"> & {
                spec: {
                    mempoolfullrbf: {
                        type: "boolean";
                    } & {
                        name: string;
                        default: false;
                        description: string;
                        warning: null;
                    };
                    persistmempool: {
                        type: "boolean";
                    } & {
                        name: string;
                        default: true;
                        description: string;
                        warning: null;
                    };
                    maxmempool: import("../../types/config-types.js").ValueSpecNumber;
                    mempoolexpiry: import("../../types/config-types.js").ValueSpecNumber;
                };
            };
            peers: {
                type: "object";
            } & Omit<{
                name: string;
                description: string;
                warning: null;
                default: null;
                "display-as": null;
                "unique-by": null;
                spec: Config<{
                    listen: {
                        type: "boolean";
                    } & {
                        name: string;
                        default: true;
                        description: string;
                        warning: null;
                    };
                    onlyconnect: {
                        type: "boolean";
                    } & {
                        name: string;
                        default: false;
                        description: string;
                        warning: null;
                    };
                    onlyonion: {
                        type: "boolean";
                    } & {
                        name: string;
                        default: false;
                        description: string;
                        warning: null;
                    };
                    addnode: import("../../types/config-types.js").ValueSpecList;
                }>;
                "value-names": {};
            }, "spec"> & {
                spec: {
                    listen: {
                        type: "boolean";
                    } & {
                        name: string;
                        default: true;
                        description: string;
                        warning: null;
                    };
                    onlyconnect: {
                        type: "boolean";
                    } & {
                        name: string;
                        default: false;
                        description: string;
                        warning: null;
                    };
                    onlyonion: {
                        type: "boolean";
                    } & {
                        name: string;
                        default: false;
                        description: string;
                        warning: null;
                    };
                    addnode: import("../../types/config-types.js").ValueSpecList;
                };
            };
            dbcache: import("../../types/config-types.js").ValueSpecNumber;
            pruning: {
                type: "union";
            } & Omit<{
                name: string;
                description: string;
                warning: string;
                default: string;
                variants: Variants<{
                    disabled: {};
                    automatic: {
                        size: import("../../types/config-types.js").ValueSpecNumber;
                    };
                    manual: {
                        size: import("../../types/config-types.js").ValueSpecNumber;
                    };
                }>;
                tag: {
                    id: "mode";
                    name: string;
                    description: string;
                    warning: null;
                    "variant-names": {
                        disabled: string;
                        automatic: string;
                        manual: string;
                    };
                };
                "display-as": null;
                "unique-by": null;
                "variant-names": null;
            }, "variants"> & {
                variants: {
                    disabled: {};
                    automatic: {
                        size: import("../../types/config-types.js").ValueSpecNumber;
                    };
                    manual: {
                        size: import("../../types/config-types.js").ValueSpecNumber;
                    };
                };
            };
            blockfilters: {
                type: "object";
            } & Omit<{
                name: string;
                description: string;
                warning: null;
                default: null;
                "display-as": null;
                "unique-by": null;
                spec: Config<{
                    blockfilterindex: {
                        type: "boolean";
                    } & {
                        name: string;
                        default: true;
                        description: string;
                        warning: null;
                    };
                    peerblockfilters: {
                        type: "boolean";
                    } & {
                        name: string;
                        default: false;
                        description: string;
                        warning: null;
                    };
                }>;
                "value-names": {};
            }, "spec"> & {
                spec: {
                    blockfilterindex: {
                        type: "boolean";
                    } & {
                        name: string;
                        default: true;
                        description: string;
                        warning: null;
                    };
                    peerblockfilters: {
                        type: "boolean";
                    } & {
                        name: string;
                        default: false;
                        description: string;
                        warning: null;
                    };
                };
            };
            bloomfilters: {
                type: "object";
            } & Omit<{
                name: string;
                description: string;
                warning: null;
                default: null;
                "display-as": null;
                "unique-by": null;
                spec: Config<{
                    peerbloomfilters: {
                        type: "boolean";
                    } & {
                        name: string;
                        default: false;
                        description: string;
                        warning: string;
                    };
                }>;
                "value-names": {};
            }, "spec"> & {
                spec: {
                    peerbloomfilters: {
                        type: "boolean";
                    } & {
                        name: string;
                        default: false;
                        description: string;
                        warning: string;
                    };
                };
            };
        };
    };
}>;
