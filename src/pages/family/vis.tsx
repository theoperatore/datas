import { useRef, useState } from 'react';
// import { pack, hierarchy, select } from 'd3';
import Head from 'next/head';

// type Relationship = {
//   type: 'CHILD' | 'PARENT' | 'SPOUSE';
//   data?: {
//     [key: string]: any;
//   };
// };

// type Graph = {
//   a: Person;
//   b: Person;
//   rel: Relationship;
// };

// type Person = {
//   id: string;
//   name: string;
// };

// type Family = {
//   parentDirectChild: Person;
//   parentInLaw?: Person;
//   offspring: Family[];
// };

export default function FamilyVisualization() {
  const svgRef = useRef<SVGSVGElement>();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // useEffect(() => {
  //   const { width, height } = svgRef.current.getBoundingClientRect();
  //   setDimensions({ width, height });
  // }, []);

  // useEffect(() => {
  //   function render() {
  //     const { width, height } = dimensions;
  //     if (height === 0 || width === 0) return;

  //     const packLayout = pack<Family>()
  //       .size([width, height - 24])
  //       .padding(3);
  //     const allData = hierarchy(data, d => d.offspring)
  //       .sum(d => d.offspring.length || 1)
  //       .sort((a, b) => a.value - b.value);

  //     const root = packLayout(allData);

  //     const svg = select('#svg-canvas');

  //     const circles = svg
  //       .append('g')
  //       .selectAll('g')
  //       .data(root.descendants())
  //       .join('g')
  //       .attr('transform', d => `translate(${d.x},${d.y})`)
  //       .append('circle')
  //       .attr('r', d => d.r)
  //       .attr('stroke', '#bbb')
  //       .attr('fill', d =>
  //         d.children ? /* color(d.depth) */ 'black' : 'white',
  //       )
  //       .attr('pointer-events', d => (!d.children ? 'none' : null));
  //     // .on('mouseover', function () {
  //     //   select(this).attr('stroke', '#000');
  //     // })
  //     // .on('mouseout', function () {
  //     //   select(this).attr('stroke', '#bbb');
  //     // });

  //     const labels = svg
  //       .append('g')
  //       .selectAll('g')
  //       .data(root.descendants())
  //       .join('g')
  //       .style('text-anchor', 'middle')
  //       .style('fill', d => (d.children ? 'white' : 'black'))
  //       .style('z-index', 50)
  //       .attr('transform', d => {
  //         if (d.children && d.children.length < 4) {
  //           return `translate(${d.x},${d.y - d.r + 24})`;
  //         }

  //         return d.children
  //           ? `translate(${d.x},${d.y - d.r})`
  //           : `translate(${d.x},${d.y})`;
  //       })
  //       .append('text')
  //       // .attr('fill-opacity', d => (d.children ? 0 : 1))
  //       .text(d =>
  //         d.data.parentInLaw
  //           ? `${d.data.parentDirectChild.name} + ${d.data.parentInLaw.name}`
  //           : d.data.parentDirectChild.name,
  //       );
  //   }

  //   render();
  // }, [dimensions]);

  return (
    <>
      <Head>
        <title>Family tree</title>
      </Head>
      <svg
        id="svg-canvas"
        ref={svgRef}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height - 24} `}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
    </>
  );
}
