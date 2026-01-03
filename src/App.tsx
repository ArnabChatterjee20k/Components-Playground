import Tree from "./Tree";
import {
  ServerIcon,
  DatabaseIcon,
  FolderIcon,
  TableIcon,
  ColumnsIcon,
  HardDriveIcon,
  CloudIcon,
  PlusIcon,
} from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import type { LucideIcon } from "lucide-react";

// Define the node type to match Tree component
interface NestedTreeNode {
  name: string;
  children?: NestedTreeNode[];
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  addChildrenIcon?: LucideIcon | React.ComponentType<{ className?: string }>;
  emptyStateElement?: (node: NestedTreeNode) => React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: (node: NestedTreeNode) => void;
  onAddChildren?: (node: NestedTreeNode) => void;
}

// Initial database explorer tree structure with icons and handlers
const initialDatabaseTree: NestedTreeNode[] = [
  {
    name: "Production Server",
    icon: ServerIcon,
    className: "font-semibold text-blue-600 dark:text-blue-400",
    onClick: (node) => {
      console.log("🔌 Server clicked:", node.name);
      alert(`Connecting to ${node.name}...`);
    },
    children: [
      {
        name: "PostgreSQL",
        icon: DatabaseIcon,
        className: "text-emerald-600 dark:text-emerald-400",
        onClick: (node) => {
          console.log("🗄️ Database clicked:", node.name);
        },
        children: [
          {
            name: "public",
            icon: FolderIcon,
            addChildrenIcon: PlusIcon,
            emptyStateElement: (node) => (
              <div className="">
                <p className="text-sm text-muted-foreground mb-2">
                  The <span className="font-semibold">{node.name}</span> schema
                  is empty
                </p>
                <p className="text-xs text-muted-foreground">
                  Click the + icon to add tables
                </p>
              </div>
            ),
            children: [],
          },
          {
            name: "analytics",
            icon: FolderIcon,
            children: [
              {
                name: "events",
                icon: TableIcon,
                onClick: (node) => {
                  console.log("📊 Table clicked:", node.name);
                },
                children: [
                  {
                    name: "event_id",
                    icon: ColumnsIcon,
                    className: "text-muted-foreground",
                  },
                  {
                    name: "timestamp",
                    icon: ColumnsIcon,
                    className: "text-muted-foreground",
                  },
                  {
                    name: "type",
                    icon: ColumnsIcon,
                    className: "text-muted-foreground",
                  },
                  {
                    name: "data",
                    icon: ColumnsIcon,
                    className: "text-muted-foreground",
                  },
                ],
              },
              {
                name: "metrics",
                icon: TableIcon,
                onClick: (node) => {
                  console.log("📊 Table clicked:", node.name);
                },
                children: [
                  {
                    name: "metric_id",
                    icon: ColumnsIcon,
                    className: "text-muted-foreground",
                  },
                  {
                    name: "value",
                    icon: ColumnsIcon,
                    className: "text-muted-foreground",
                  },
                  {
                    name: "timestamp",
                    icon: ColumnsIcon,
                    className: "text-muted-foreground",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "MySQL",
        icon: DatabaseIcon,
        className: "text-orange-600 dark:text-orange-400",
        onClick: (node) => {
          console.log("🗄️ Database clicked:", node.name);
        },
        children: [
          {
            name: "app_db",
            icon: FolderIcon,
            children: [
              {
                name: "sessions",
                icon: TableIcon,
                onClick: (node) => {
                  console.log("📊 Table clicked:", node.name);
                },
                children: [
                  {
                    name: "session_id",
                    icon: ColumnsIcon,
                    className: "text-muted-foreground",
                  },
                  {
                    name: "user_id",
                    icon: ColumnsIcon,
                    className: "text-muted-foreground",
                  },
                  {
                    name: "expires_at",
                    icon: ColumnsIcon,
                    className: "text-muted-foreground",
                  },
                ],
              },
              {
                name: "cache",
                icon: TableIcon,
                onClick: (node) => {
                  console.log("📊 Table clicked:", node.name);
                },
                children: [
                  {
                    name: "key",
                    icon: ColumnsIcon,
                    className: "text-muted-foreground",
                  },
                  {
                    name: "value",
                    icon: ColumnsIcon,
                    className: "text-muted-foreground",
                  },
                  {
                    name: "expires_at",
                    icon: ColumnsIcon,
                    className: "text-muted-foreground",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Development Server",
    icon: ServerIcon,
    className: "font-semibold text-purple-600 dark:text-green-400",
    onClick: (node) => {
      console.log("🔌 Server clicked:", node.name);
    },
    children: [
      {
        name: "SQLite",
        icon: HardDriveIcon,
        className: "text-cyan-600 dark:text-cyan-400",
        children: [
          {
            name: "test.db",
            icon: DatabaseIcon,
            onClick: (node) => {
              console.log("🗄️ Database clicked:", node.name);
            },
            children: [
              {
                name: "test_table",
                icon: TableIcon,
                onClick: (node) => {
                  console.log("📊 Table clicked:", node.name);
                },
                children: [
                  {
                    name: "id",
                    icon: ColumnsIcon,
                    className: "text-muted-foreground",
                  },
                  {
                    name: "data",
                    icon: ColumnsIcon,
                    className: "text-muted-foreground",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Cloud Server (Offline)",
    icon: CloudIcon,
    className: "font-semibold text-muted-foreground opacity-60",
    disabled: false,
    onClick: (node) => {
      console.log("🔌 Server clicked (disabled):", node.name);
    },
    emptyStateElement: (node) => (
      <div className="py-4 px-4 text-center">
        <p className="text-sm text-muted-foreground mb-2">
          {node.name} is currently offline
        </p>
        <button
          className="text-xs px-3 py-1.5 bg-primary/10 hover:bg-primary/20 rounded-md transition-colors"
          onClick={() => alert(`Would reconnect to ${node.name}`)}
        >
          Reconnect
        </button>
      </div>
    ),
    children: [],
  },
];

// Helper function to find a node in the tree by reference or by matching
// This helps us find the actual node in databaseTree even if we have a reference from treeWithHandlers
const findNodeInTree = (
  tree: NestedTreeNode[],
  targetNode: NestedTreeNode
): NestedTreeNode | null => {
  for (const node of tree) {
    // Match by reference first (fastest and most reliable)
    if (node === targetNode) {
      return node;
    }

    // If reference doesn't match, try to match by comparing key properties
    // This handles the case where treeWithHandlers created new objects
    if (
      node.name === targetNode.name &&
      node.icon === targetNode.icon &&
      node.className === targetNode.className &&
      node.children?.length === targetNode.children?.length
    ) {
      // Check if it's likely the same node by comparing first child (if exists)
      if (!targetNode.children || targetNode.children.length === 0) {
        // Both are empty or leaf nodes with same properties - likely match
        if (!node.children || node.children.length === 0) {
          return node;
        }
      } else if (node.children && node.children.length > 0) {
        // Both have children, check if first child matches
        if (node.children[0]?.name === targetNode.children[0]?.name) {
          return node;
        }
      }
    }

    // Recursively search in children
    if (node.children) {
      const found = findNodeInTree(node.children, targetNode);
      if (found) {
        return found;
      }
    }
  }
  return null;
};

// Function to add a child node to a parent node in the tree
// Returns a new tree state with the child added
const addChildToTree = (
  tree: NestedTreeNode[],
  parentNode: NestedTreeNode,
  newChild: NestedTreeNode
): NestedTreeNode[] => {
  // First, find the actual parent node in the tree
  const actualParent = findNodeInTree(tree, parentNode);

  if (!actualParent) {
    console.error("Could not find parent node in tree:", parentNode.name);
    return tree;
  }

  return tree.map((node) => {
    // If this is the parent node, add the new child
    if (node === actualParent) {
      return {
        ...node,
        children: [...(node.children || []), newChild],
      };
    }

    // Recursively search in children
    if (node.children) {
      return {
        ...node,
        children: addChildToTree(node.children, parentNode, newChild),
      };
    }

    return node;
  });
};

export default function App() {
  const [lastExpanded, setLastExpanded] = useState<string | null>(null);
  const [databaseTree, setDatabaseTree] =
    useState<NestedTreeNode[]>(initialDatabaseTree);

  const handleExpand = (nodeId: string) => {
    setLastExpanded(nodeId);
    console.log("📂 Node expanded:", nodeId);
  };

  const handleAddChildren = useCallback(
    (node: NestedTreeNode) => {
      console.log("➕ Add children to:", node.name);

      // Generate a new table name (you could make this more sophisticated)
      const tableNumber = (node.children?.length || 0) + 1;
      const newTableName = `new_table_${tableNumber}`;

      const newTable: NestedTreeNode = {
        name: newTableName,
        icon: TableIcon,
        onClick: (node) => {
          console.log("📊 Table clicked:", node.name);
        },
        children: [
          {
            name: "id",
            icon: ColumnsIcon,
            className: "text-muted-foreground",
          },
          {
            name: "created_at",
            icon: ColumnsIcon,
            className: "text-muted-foreground",
          },
        ],
      };

      // Use the simple function to add child and get updated state
      const updatedTree = addChildToTree(databaseTree, node, newTable);
      setDatabaseTree(updatedTree);
    },
    [databaseTree]
  );

  // Attach handlers to tree nodes using useMemo
  const treeWithHandlers = useMemo(() => {
    const attachHandlers = (nodes: NestedTreeNode[]): NestedTreeNode[] => {
      return nodes.map((node) => {
        const newNode = { ...node };

        // Attach onAddChildren handler to nodes that have addChildrenIcon
        if (newNode.addChildrenIcon && !newNode.onAddChildren) {
          newNode.onAddChildren = handleAddChildren;
        }

        // Recursively process children
        if (newNode.children) {
          newNode.children = attachHandlers(newNode.children);
        }

        return newNode;
      });
    };

    return attachHandlers(databaseTree);
  }, [databaseTree, handleAddChildren]);

  return (
    <div className="container py-8 mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Database Explorer</h1>
        <p className="text-muted-foreground">
          Click on nodes to interact. Check console for click events.
        </p>
        {lastExpanded && (
          <p className="text-sm text-muted-foreground mt-2">
            Last expanded:{" "}
            <span className="font-mono text-xs">{lastExpanded}</span>
          </p>
        )}
      </div>

      <div className="border rounded-lg p-4 bg-card">
        <Tree nodes={treeWithHandlers} indent={20} onExpand={handleExpand} />
      </div>
    </div>
  );
}
