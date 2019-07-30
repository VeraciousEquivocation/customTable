import React, { Component } from 'react';
import scss from  './TableBody.module.scss';

import PropTypes from 'prop-types';

import classNames from 'classnames';

class TableBody extends Component {
    state = {
        headers: this.props.headers,
        rows: this.props.rows,
        totalColumns: this.props.totalColumns
    };
    
    handleHeaderDragStart = (event, col, index) => {
        this.props.handleHeaderDragStart(event, col, index);
    }
    handleHeaderDragStop = (event, col, index) => {
        this.props.handleHeaderDragStop(event, col, index);
    }

    render () {
        const { rows } = this.props;
        const { headers } = this.state;

        let rowsToPush = rows.map((row,index) => {
            let productCol = (
                <div
                    onClick={()=>this.props.handleLevel1Click(index)}
                    key={row.product+'KEY'+index}
                    product-index={index}
                    style={{width:headers[0].width+'px'}} 
                    className={classNames(scss.column0,'column0','trafficTblCell',scss.trafficTableCell,scss.productCell,scss.tableFlexRow,row.selected ? scss.highlightSelected : null, row.selected ? 'trafficCellIsSelected' : null)}
                >{row.product}</div>
            );
            let rowCols = [];
            rowCols.push(productCol);

            // now we have product in place.

            let placements = row.placements.map((placement,i) => {
                let groupedPlacementRows = [];
                let groupedCreativeRows = [];
                let genericcolumns = [];

                headers.forEach((obj, j) => {
                    if(j===0 || j > 3) return;
                        groupedPlacementRows.push(
                            <div onClick={()=>this.props.handleLevel2Click(index,i)} product-index={index} placement-index={i} key={"row"+i+'_col'+j} style={{width:obj.width+'px'}} 
                                className={classNames(scss[`column${j}`],("column"+j),'trafficTblCell',scss.tableFlexRow,scss.trafficTableCell, placement.selected ? scss.highlightSelected : null, placement.selected ? 'trafficCellIsSelected' : null, j>1 ? scss.centerCellContent:null)}>{placement[obj.key]}
                            </div>
                        );
                });
                
                placement.generics.forEach((generic,k)=>{
                    genericcolumns = [];
                    headers.forEach((obj, l) => {
                        if(l <= 3) return;
                        genericcolumns.push(<div onClick={()=>this.props.handleLevel3Click(index,i,k)} key={"row"+i+'_cre'+k+'_col'+l} style={{width:obj.width+'px'}} className={classNames(scss[`column${l}`],("column"+l),'trafficTblCell',scss.trafficTableCell, generic.selected ? scss.highlightSelected : null, generic.selected ? 'trafficCellIsSelected' : null, (l>4 && l<8 && l!==6) ? scss.centerCellContent:null, l===8 ? scss.productCell : null)}>{generic[obj.key]}</div>);
                    });
                    groupedCreativeRows.push(<div product-index={index} placement-index={i} generic-index={k} key={"row"+i+'_cre'+k} className={classNames(scss.tableFlexRow)}>{genericcolumns}</div>);
                });
                // CREATE EMPTY GENERIC ROWS
                if(groupedCreativeRows.length <= 0) {
                    genericcolumns = [];
                    headers.forEach((obj, l) => {
                        if(l <= 3) return;
                        genericcolumns.push(<div key={"row"+i+'_cre0'+'_col'+l} style={l===8 ? {width:(obj.width-1)+'px'}:{width:obj.width+'px'}} className={classNames('trafficTblCell', scss.trafficTblCell)}></div>);
                    });
                    groupedCreativeRows.push(<div product-index={index} placement-index={i} key={"row"+i+'_cre'+4} className={classNames(scss.tableFlexRow, 'emptyCreativeRow', scss.emptyCreativeRow)}>{genericcolumns}</div>);
                }

                groupedPlacementRows.push(<div key={"row"+i+'_creBox'} className={classNames(scss.tableFlexCol)}>{groupedCreativeRows}</div>);
                return(<div key={"row"+i} className={classNames(scss.tableFlexRow)}>{groupedPlacementRows}</div>);
            });

            rowCols.push(<div key={row.product+'_placements'+index} className={classNames(scss.tableFlexCol)}>{placements}</div>)
            
            return (<div key={row.product} className={classNames(scss.tableFlexRow)}>{rowCols}</div>);
        });

        return (
            <React.Fragment>
                <div className={classNames(scss.tableFlexCol,"TrafficBodyContainer")}>
                    {rowsToPush}
                </div>
            </React.Fragment>
        )
    }
}

TableBody.propTypes = {
    headers: PropTypes.array.isRequired,
    rows: PropTypes.array.isRequired,
    handleLevel3Click: PropTypes.func,
    handleLevel2Click: PropTypes.func,
    handleLevel1Click: PropTypes.func,
};


export default TableBody;