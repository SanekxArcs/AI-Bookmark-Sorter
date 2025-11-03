import React, { useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

interface GraphNode {
    id: string;
    name: string;
    type: 'folder' | 'bookmark';
    url?: string;
}

interface GraphLink {
    source: string;
    target: string;
    type: 'hierarchy' | 'tag';
}

interface GraphVisualizerProps {
    data: {
        nodes: GraphNode[];
        links: GraphLink[];
    };
    theme: 'light' | 'dark';
}

const Legend: React.FC<{ theme: 'light' | 'dark' }> = ({ theme }) => {
    const folderColor = theme === 'dark' ? 'rgb(75, 85, 99)' : 'rgb(209, 213, 219)';
    const bookmarkColor = theme === 'dark' ? 'rgb(96, 165, 250)' : 'rgb(59, 130, 246)';
    const hierarchyLinkColor = theme === 'dark' ? 'rgb(107, 114, 128)' : 'rgb(156, 163, 175)';
    const tagLinkColor = theme === 'dark' ? 'rgb(45, 212, 191)' : 'rgb(20, 184, 166)';

    return (
        <div className="absolute top-2 right-2 bg-gray-100/80 dark:bg-gray-900/80 p-2 border border-gray-300 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-300">
            <h4 className="font-bold mb-1">Legend</h4>
            <div className="flex items-center"><div className="w-4 h-4 mr-2" style={{ backgroundColor: folderColor }}></div>Folder</div>
            <div className="flex items-center"><div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: bookmarkColor }}></div>Bookmark</div>
            <div className="flex items-center mt-1"><div className="w-4 h-0.5 mr-1.5" style={{ backgroundColor: hierarchyLinkColor }}></div>Hierarchy Link</div>
            <div className="flex items-center">
                <svg width="16" height="4" viewBox="0 0 16 4" className="mr-1.5">
                    <line x1="0" y1="2" x2="16" y2="2" stroke={tagLinkColor} strokeWidth="2" strokeDasharray="2,2"/>
                </svg>
                Tag Link
            </div>
        </div>
    );
};

export const GraphVisualizer: React.FC<GraphVisualizerProps> = ({ data, theme }) => {
    // FIX: Initialize useRef with null to resolve "Expected 1 arguments, but got 0" error.
    const fgRef = useRef<any>(null);

    const handleNodeClick = (node: any) => {
        if (node.type === 'bookmark' && node.url) {
            window.open(node.url, '_blank');
        }
    };

    const drawNode = (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
        const label = node.name;
        const fontSize = 12 / globalScale;
        ctx.font = `${fontSize}px Sans-Serif`;

        // Node shape and color
        if (node.type === 'folder') {
            // A larger, more distinct square for folders
            ctx.fillStyle = theme === 'dark' ? 'rgba(75, 85, 99, 0.9)' : 'rgba(209, 213, 219, 0.9)'; // gray-600 dark, gray-300 light
            ctx.fillRect(node.x - 8, node.y - 8, 16, 16);
        } else {
             // A vibrant circle for bookmarks
            ctx.fillStyle = theme === 'dark' ? 'rgba(96, 165, 250, 0.9)' : 'rgba(59, 130, 246, 0.9)'; // blue-400 dark, blue-500 light
            ctx.beginPath();
            ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
            ctx.fill();
        }

        // Node label
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = theme === 'dark' ? 'rgba(229, 231, 235, 0.9)' : 'rgba(17, 24, 39, 0.9)'; // gray-200 or gray-900
        ctx.fillText(label, node.x, node.y + 15);
    };

    const linkColor = (link: any) => {
        if (link.type === 'tag') {
            return theme === 'dark' ? 'rgba(45, 212, 191, 0.5)' : 'rgba(20, 184, 166, 0.5)';
        }
        return theme === 'dark' ? 'rgba(107, 114, 128, 0.7)' : 'rgba(156, 163, 175, 0.7)';
    };

    const linkWidth = (link: any) => {
        return link.type === 'tag' ? 0.3 : 1;
    };

    return (
        <div className="bg-transparent border border-gray-200 dark:border-gray-800 h-[60vh] w-full relative">
            <ForceGraph2D
                ref={fgRef}
                graphData={data}
                nodeCanvasObject={drawNode}
                onNodeClick={handleNodeClick}
                linkColor={linkColor}
                linkWidth={linkWidth}
                linkLineDash={(link: any) => link.type === 'tag' ? [2, 2] : []}
                backgroundColor={theme === 'dark' ? '#000000' : '#FFFFFF'}
                cooldownTicks={100}
                // FIX: The onEngineStop callback does not receive arguments. Use a ref to access the graph instance.
                onEngineStop={() => fgRef.current?.zoomToFit(400, 100)}
            />
            <Legend theme={theme} />
        </div>
    );
};
