import React, { Component } from 'react';
import scss from './TrafficTable.module.scss';

import classNames from 'classnames';
import update from 'immutability-helper';

import TrafficHeader from './TableHeader/TableHeader';
import TableBody from './TableBody/TableBody';

import ErrorBoundary from '../../../components/ErrorBoundary/ErrorBoundary';

class TrafficTable extends Component {
    state = {
        headers: this.props.headers,
        rows: this.props.rows,
        totalColumns: this.props.headers.length,
        prevX: 0,
        tableContainerWidth: 0,
        ttlPub: 0,
        ttlPla: 0,
        ttlCre: 0
    };
    
    componentDidMount() {
        let ttlWidth = 0;
        this.state.headers.forEach(header => {
            ttlWidth = ttlWidth + header.width + 2;
        });
        let tblWinWidth = document.getElementById('tableWindow').offsetWidth;
        if(tblWinWidth - 36 < ttlWidth) {
            this.setState({tableContainerWidth:ttlWidth});
        }
        // update container width based on headers
    }
    handleHeaderDragStart = (event, col, index) => {
        this.setState({prevX:event.pageX});
    }
    handleHeaderDragStop = (event, col, index) => {
        let width = event.pageX - this.state.prevX;
        let updatedHeaders = [...this.state.headers];
        width = updatedHeaders[index].width + width;

        updatedHeaders[index].width = width <= 20 ? 20 : width;
        
        let ttlWidth = 0;
        this.state.headers.forEach(header => {
            ttlWidth = ttlWidth + header.width + 2;
        });

        this.setState({headers:updatedHeaders, tableContainerWidth: ttlWidth});

    }
    handleLevel1Click = (lvl1Index) => {
        let ttlPub = this.state.ttlPub;
        let ttlPla = this.state.ttlPla;
        let ttlCre = this.state.ttlCre;
        let maxPub = document.getElementsByClassName('column0').length;
        let maxPla = document.getElementsByClassName('column1').length;
        let maxCre = document.getElementsByClassName('column4').length;

        let onePlacementIsSelected = this.state.rows[lvl1Index].placements.some(obj => {
            return obj.selected === true;
        });
        let oneGenericIsSelected = false;

        for(let i=0; i<this.state.rows[lvl1Index].placements.length; i++) {
            if (
                this.state.rows[lvl1Index].placements[i].generics.some(obj => {
                    return obj.selected === true;
                })
            ) {
                oneGenericIsSelected = true;
                break;
            }
        };

        let newRows = [];
        if(this.state.rows[lvl1Index].selected) {
            //Unselect placements and generics, and self
            if(oneGenericIsSelected) {
                newRows = update(this.state.rows,{
                    [lvl1Index]: oneDeep => update(oneDeep, {
                        placements: {$apply: placements => { return placements.map(pla => {
                            let newPla = {...pla}; 
                            newPla.generics = newPla.generics.map(cre => {let newCre = {...cre}; newCre.selected = false; if(cre.selected)ttlCre = ttlCre - 1; return newCre;});
                            return newPla;
                        });} }
                    })
                });

            } else if(onePlacementIsSelected) {
                newRows = update(this.state.rows,{
                    [lvl1Index]: oneDeep => update(oneDeep, {
                        placements: {$apply: placements => { return placements.map(pla => {let newPla = {...pla}; newPla.selected = false; if(pla.selected)ttlPla = ttlPla - 1; return newPla;});} }
                    })
                });
            } else {
                newRows = update(this.state.rows,{
                    [lvl1Index]: oneDeep => update(oneDeep, {
                        selected: {$set: false}
                    })
                });
                ttlPub = ttlPub - 1;
            }
        } else {
            newRows = update(this.state.rows,{
                [lvl1Index]: oneDeep => update(oneDeep, {
                    selected: {$set: true},
                    placements: {$apply: placements => { return placements.map(pla => {
                        let newPla = {...pla};
                        newPla.generics = newPla.generics.map(cre => {let newCre = {...cre}; newCre.selected = true; if(ttlCre < maxCre && !cre.selected)ttlCre = ttlCre + 1; return newCre;});
                        newPla.selected = true;
                        if(ttlPla < maxPla && !pla.selected)ttlPla = ttlPla + 1;
                        return newPla;
                    });} }
                })
            });
            if(ttlPub < maxPub)ttlPub = ttlPub + 1;
        }
        this.setState({rows:newRows, ttlPub, ttlPla, ttlCre});
    };
    handleLevel2Click = (lvl1Index, lvl2Index) => {
        let ttlPla = this.state.ttlPla;
        let ttlCre = this.state.ttlCre;
        let maxPla = document.getElementsByClassName('column1').length;
        let maxCre = document.getElementsByClassName('column4').length;

        let oneGenericIsSelected = this.state.rows[lvl1Index].placements[lvl2Index].generics.some(obj => {
            return obj.selected === true;
        });

        let newRows = [];
        if(this.state.rows[lvl1Index].placements[lvl2Index].selected) {
            //Unselect placements and generics
            if(oneGenericIsSelected) {
                newRows = update(this.state.rows,{
                    [lvl1Index]: oneDeep => update(oneDeep, {
                        placements: placements => update(placements,{
                            [lvl2Index]: twoDeep => update(twoDeep, {
                                generics: {$apply: generics => { return generics.map(cre => {let newCre = {...cre}; newCre.selected = false; if(cre.selected)ttlCre = ttlCre - 1; return newCre;});} }
                            })
                        })
                    })
                });
            } else {
                newRows = update(this.state.rows,{
                    [lvl1Index]: oneDeep => update(oneDeep, {
                        placements: placements => update(placements,{
                            [lvl2Index]: twoDeep => update(twoDeep, {
                                selected: {$set: false}
                            })
                        })
                    })
                });
                ttlPla = ttlPla - 1;
            }
        } else {
            newRows = update(this.state.rows,{
                [lvl1Index]: oneDeep => update(oneDeep, {
                    placements: placements => update(placements,{
                        [lvl2Index]: twoDeep => update(twoDeep, {
                            selected: {$set: true},
                            generics: {$apply: generics => { return generics.map(cre => {let newCre = {...cre}; newCre.selected = true; if(ttlCre < maxCre && !cre.selected) ttlCre = ttlCre + 1; return newCre;});} }
                        })
                    })
                })
            });
            if(ttlPla < maxPla) ttlPla = ttlPla + 1;
        }

        this.setState({rows:newRows, ttlPla, ttlCre});
    };
    handleLevel3Click = (lvl1Index, lvl2Index, lvl3Index) => {
        let ttlCre = this.state.ttlCre;

        let maxCre = document.getElementsByClassName('column4').length;

        let newRows = update(this.state.rows,{
            [lvl1Index]: oneDeep => update(oneDeep, {
                placements: placements => update(placements,{
                    [lvl2Index]: twoDeep => update(twoDeep, {
                        generics: generics=> update(generics,{
                            [lvl3Index]: threeDeep => update(threeDeep,{
                                selected: {$apply: orig => {return !orig;}}
                            })
                        })
                    })
                })
            })
        });
        let isSelected = newRows[lvl1Index].placements[lvl2Index].generics[lvl3Index].selected;
        if(isSelected && this.state.ttlCre < maxCre) 
            ttlCre =  ttlCre + 1;
        else if(!isSelected) ttlCre =  ttlCre - 1;

        this.setState({rows:newRows, ttlCre});
    };
    level1HeaderClick = () => {
        let ttlPub = 0;
        let ttlPla = 0;
        let ttlCre = 0;

        let maxPub = document.getElementsByClassName('column0').length;
        let maxPla = document.getElementsByClassName('column1').length;
        let maxCre = document.getElementsByClassName('column4').length;

        let newRows;
        if(this.state.ttlPub === maxPub) {
            //remove all
            newRows= update(this.state.rows,{
                $apply: products => { 
                    return products.map(pub => {
                        let newPub = {...pub};
                        newPub.selected = false;
                        newPub.placements =  newPub.placements.map(pla => {
                            let newPla = {...pla};
                            newPla.generics = newPla.generics.map(cre => {let newCre = {...cre}; newCre.selected = false; return newCre;});
                            newPla.selected = false;
                            return newPla;
                        });
                        return newPub;
                    });
                }
            });
        } else {
            //add all
            newRows= update(this.state.rows,{
                $apply: products => { 
                    return products.map(pub => {
                        let newPub = {...pub};
                        newPub.selected = true;
                        newPub.placements =  newPub.placements.map(pla => {
                            let newPla = {...pla};
                            newPla.generics = newPla.generics.map(cre => {let newCre = {...cre}; newCre.selected = true; ttlCre = ttlCre + 1; return newCre;});
                            newPla.selected = true;
                            ttlPla = ttlPla + 1;
                            return newPla;
                        });
                        ttlPub = ttlPub + 1;
                        return newPub;
                    });
                }
            });
        }
        
        this.setState({rows:newRows, ttlPub,ttlPla,ttlCre});
    }
    level2HeaderClick = () => {
        let ttlPub = 0;
        let ttlPla = 0;
        let ttlCre = 0;

        let maxCre = document.getElementsByClassName('column4').length;
        let maxPla = document.getElementsByClassName('column1').length;

        let newRows;

        if(this.state.ttlPub <= 0 && this.state.ttlPla === maxPla && this.state.ttlCre === maxCre) {
            // remove generics
            newRows = update(this.state.rows,{
                $apply: products => { 
                    return products.map(pub => {
                        let newPub = {...pub};
                        newPub.selected = false;
                        newPub.placements =  newPub.placements.map(pla => {
                            let newPla = {...pla};
                            newPla.generics = newPla.generics.map(cre => {let newCre = {...cre}; newCre.selected = false; return newCre;});
                            newPla.selected = true;
                            ttlPla = ttlPla + 1;
                            return newPla;
                        });
                        return newPub;
                    
                    });
                }
            });
        } else if (this.state.ttlPub <= 0 && this.state.ttlPla === maxPla && this.state.ttlCre <= 0) {
            //remove placements
            newRows = update(this.state.rows,{
                $apply: products => { 
                    return products.map(pub => {
                        let newPub = {...pub};
                        newPub.selected = false;
                        newPub.placements =  newPub.placements.map(pla => {
                            let newPla = {...pla};
                            newPla.generics = newPla.generics.map(cre => {let newCre = {...cre}; newCre.selected = false; return newCre;});
                            newPla.selected = false;
                            return newPla;
                        });
                        return newPub;
                    
                    });
                }
            });
        } else {
            //remove Products and add all placements and generics
            newRows = update(this.state.rows,{
                $apply: products => { 
                    return products.map(pub => {
                        let newPub = {...pub};
                        newPub.selected = false;
                        newPub.placements =  newPub.placements.map(pla => {
                            let newPla = {...pla};
                            newPla.generics = newPla.generics.map(cre => {let newCre = {...cre}; newCre.selected = true; ttlCre = ttlCre + 1; return newCre;});
                            newPla.selected = true;
                            ttlPla = ttlPla + 1;
                            return newPla;
                        });
                        return newPub;
                    
                    });
                }
            });
        }
        this.setState({rows:newRows, ttlPub,ttlPla,ttlCre});
    }
    level3HeaderClick = () => {
        let ttlPub = 0;
        let ttlPla = 0;
        let ttlCre = 0;

        let maxCre = document.getElementsByClassName('column4').length;

        let newRows;
        if(this.state.ttlPub <= 0 && this.state.ttlPla <= 0 && this.state.ttlCre === maxCre) {
            //remove generics
            newRows = update(this.state.rows,{
                $apply: products => {  
                    return products.map(pub => {
                        let newPub = {...pub};
                        newPub.selected = false;
                        newPub.placements =  newPub.placements.map(pla => {
                            let newPla = {...pla};
                            newPla.generics = newPla.generics.map(cre => {let newCre = {...cre}; newCre.selected = false; return newCre;});
                            newPla.selected = false;
                            return newPla;
                        });
                        return newPub;
                    
                    });
                }
            });
        } else {
            // set all generics, rest remove
            newRows = update(this.state.rows,{
                $apply: products => {  
                    return products.map(pub => {
                        let newPub = {...pub};
                        newPub.selected = false;
                        newPub.placements =  newPub.placements.map(pla => {
                            let newPla = {...pla};
                            newPla.generics = newPla.generics.map(cre => {let newCre = {...cre}; newCre.selected = true; ttlCre = ttlCre + 1; return newCre;});
                            newPla.selected = false;
                            return newPla;
                        });
                        return newPub;
                    
                    });
                }
            });
        }
        this.setState({rows:newRows, ttlPub,ttlPla,ttlCre});
    }
    render () {
        return (
            <React.Fragment>
                <p className={scss.title}>CUSTOM TABLE</p>
                <div id='tableWindow' className={classNames(scss.trafficTableWindow)}>
                    <ErrorBoundary>
                    <div id='TrafficTableContainer' className={scss.TrafficTableContainer} style={this.state.tableContainerWidth > 0 ? {width:this.state.tableContainerWidth}:null}>
                        <TrafficHeader 
                            headers={this.state.headers}
                            totalColumns={this.state.totalColumns}
                            handleHeaderDragStart = {this.handleHeaderDragStart}
                            handleHeaderDragStop = {this.handleHeaderDragStop}
                            level1HeaderClick = {this.level1HeaderClick}
                            level2HeaderClick = {this.level2HeaderClick}
                            level3HeaderClick = {this.level3HeaderClick}
                            ttlPub = {this.state.ttlPub}
                            ttlPla = {this.state.ttlPla}
                            ttlCre = {this.state.ttlCre}
                        />
                        <TableBody 
                            headers={this.state.headers}
                            rows={this.state.rows}
                            handleLevel3Click = {this.handleLevel3Click}
                            handleLevel2Click = {this.handleLevel2Click}
                            handleLevel1Click = {this.handleLevel1Click}
                        />
                    </div>
                    </ErrorBoundary>
                </div>
            </React.Fragment>
        )
    }
}

export default TrafficTable;