import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  FileTrigger,
} from "@/components/ui/accordion";

import { useState } from "react";

interface NestedTreeNode {
  name: string;
  children?: NestedTreeNode[];
}

interface FlatTreeNode extends Omit<NestedTreeNode, "children"> {
  depth: number;
  parent: string;
  children: boolean;
}

// using initial so that in case of large tree we dont have to spread and create objects everytime

interface TreeProps {
  nodes: NestedTreeNode[];
  indent?: number;
  onExpand?: (id: string) => void;
}

function walkTree(
  tree: NestedTreeNode[],
  initial: FlatTreeNode[] = [],
  depth = 0,
  parent = "ROOT"
) {
  tree.forEach((node) => {
    initial.push({
      name: node.name,
      depth: depth,
      parent,
      children: !!node.children?.length,
    });
    if (node?.children) walkTree(node.children, initial, depth + 1, node.name);
  });

  return initial;
}

const getAllChildren = (
  parentId: string,
  relation: Map<string, string[]>,
  initial: Set<string> = new Set()
) => {
  const children = relation.get(parentId) || [];
  children.forEach((child) => {
    initial.add(child);
    getAllChildren(child, relation, initial);
  });
  return initial;
};

export default function Tree({ nodes, indent = 10 }: TreeProps) {
  const flatNodes = walkTree(nodes);
  const childrenMap = new Map<string, string[]>();
  flatNodes.forEach((node) => {
    if (!childrenMap.has(node.parent)) {
      childrenMap.set(node.parent, []);
    }
    childrenMap.get(node.parent)!.push(node.name);
  });
  const [expandedNodes, setExpandedNodes] = useState(new Set<string>());
  // for storing the nodes those were opened before the parent was closed
  const [subExpandedNodes, setSubExpandedNodes] = useState(
    new Map<string, Set<string>>()
  );

  const handleExpand = (nodeIds: string[]) => {
    setExpandedNodes((currentNodeIds) => {
      const newNodeIds = new Set(nodeIds);
      const newSubExpandedNodes = new Map(subExpandedNodes);

      // closing children and storing them in the subExpanded nodes
      currentNodeIds.forEach((node) => {
        if (!newNodeIds.has(node)) {
          const childrens = getAllChildren(node, childrenMap);
          // store what was opened and in present in the openedIds
          newSubExpandedNodes.set(
            node,
            new Set([...childrens].filter((child) => currentNodeIds.has(child)))
          );
          childrens.forEach((child) => newNodeIds.delete(child));
        }
      });

      // reopening subExpandedNodes which were opened
      newNodeIds.forEach((newNode) => {
        if (newSubExpandedNodes.has(newNode)) {
          newSubExpandedNodes.get(newNode)?.forEach((node) => {
            newNodeIds.add(node);
          });
          newSubExpandedNodes.delete(newNode);
        }
      });

      setSubExpandedNodes(newSubExpandedNodes);
      return newNodeIds;
    });
  };

  return (
    <Accordion
      onValueChange={(value) => handleExpand(value)}
      value={[...expandedNodes]}
      type="multiple"
      className="w-full"
    >
      {flatNodes.map(
        (node) =>
          (node.parent === "ROOT" || expandedNodes.has(node.parent)) && (
            <AccordionItem
              value={node.name}
              style={{ paddingLeft: node.depth * indent }}
              className="border-b-0"
            >
              {node.children || node.parent === "ROOT" ? (
                <FileTrigger className="py-2">{node.name}</FileTrigger>
              ) : (
                <div className="py-2 flex items-center">
                  {/* spacer to align with chevron */}
                  <span className="inline-flex w-4 mr-1 shrink-0" />
                  <span>{node.name}</span>
                </div>
              )}
            </AccordionItem>
          )
      )}
    </Accordion>
  );
}
