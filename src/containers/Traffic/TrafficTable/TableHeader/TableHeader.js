import React, { Component } from 'react';
import scss from './TableHeader.module.scss';

import PropTypes from 'prop-types';

import classNames from 'classnames';

class TableHeader extends Component {
    state = {
        headers: this.props.headers,
        totalColumns: this.props.totalColumns,
        prevX: 0
    };

    handleHeaderDragStart = (event, col, index) => {
        this.props.handleHeaderDragStart(event, col, index);
    }
    handleHeaderDragStop = (event, col, index) => {
        this.props.handleHeaderDragStop(event, col, index);
    }

    render () {
        let height = 48;
        let widthAdditions = 0;
        let resizeHandleStyles = {
            resizeHandleStyle: {
                height: height,
                position: 'absolute',
                width: 7,
                cursor: 'ew-resize',
                marginLeft: -3,
                zIndex: 2,
                MozBoxSizing: 'border-box',
                boxSizing: 'border-box'
            
            },
        };
        let handles = this.state.headers.map((col, index) => {
            //determining position of resize handles
            widthAdditions = widthAdditions + col.width;
            resizeHandleStyles.leftPos = {left: widthAdditions};
            let curStyle = (index < (this.state.totalColumns)) ? resizeHandleStyles.resizeHandleStyle : null;
            curStyle = {...curStyle,...resizeHandleStyles.leftPos}
            return (
            <div key={col.name} style={curStyle}
                data_index={index}
                draggable="true"
                onDragStart={(event) => this.handleHeaderDragStart(event, col, index)}
                onDragEnd={(event) => this.handleHeaderDragStop(event, col, index)}>
            </div>
        
            );
        });
        let headers = this.state.headers.map((header,index) => {
            
            let click = null;
            let ttl = null;

            switch (index) {
                case 0:
                    click = this.props.level1HeaderClick;
                    ttl = this.props.ttlPub;
                    break;
                case 1:
                    click = this.props.level2HeaderClick;
                    ttl = this.props.ttlPla;
                    break;
                case 4:
                    click = this.props.level3HeaderClick;
                    ttl = this.props.ttlCre;
                    break;
                default:
                    break;
            }
            return (
                <div 
                    onClick={click}
                    key={header.name} 
                    style={{width:header.width+'px'}}
                    className={classNames(scss.TrafficHeader, "TrafficHeader")}
                >
                    <span className={ttl > 0 ? scss.trafficHeaderLbl:null}>{header.name}</span>
                    {ttl > 0 ? <span className={scss.TrafficHeaderTtl}>{ttl}</span>:null}
                </div>
            )
        });
        return (
            <React.Fragment>
                <div className={scss.resize_container}>
                    {handles}
                </div>
                <div className={scss.TrafficHeaderContainer}>
                    {headers}
                </div>
            </React.Fragment>
        )
    }
}

TableHeader.propTypes = {
    handleHeaderDragStart: PropTypes.func.isRequired,
    handleHeaderDragStop: PropTypes.func.isRequired,
    headers: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        width: PropTypes.number.isRequired,
        key: PropTypes.string.isRequired
    })).isRequired,
    totalColumns: PropTypes.number.isRequired,
    level1HeaderClick: PropTypes.func,
    level2HeaderClick: PropTypes.func,
    level3HeaderClick: PropTypes.func,
    ttlPub: PropTypes.number,
    ttlPla: PropTypes.number,
    ttlcre: PropTypes.number
};


export default TableHeader;