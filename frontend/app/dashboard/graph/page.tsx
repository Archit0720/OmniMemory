'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import {
  Background,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
} from '@xyflow/react'

import {
  Brain,
  FileText,
  Image as ImageIcon,
  Loader2,
  Network,
  RefreshCw,
  Search,
} from 'lucide-react'

import { getMemoryGraph } from '@/lib/api'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface MemoryNodeData {
  label: string
  memory_id: number
  summary?: string
  memory_type?: string
  source_type?: string
  status?: string
  products?: string[]
  people?: string[]
  organizations?: string[]
  locations?: string[]
  dates?: string[]
  topics?: string[]
  keywords?: string[]
}

interface FlowNodeData extends Record<string, unknown> {
  label: ReactNode
  originalLabel: string
  memory_id: number
  summary?: string
  memory_type?: string
  source_type?: string
  status?: string
  products?: string[]
  people?: string[]
  organizations?: string[]
  locations?: string[]
  dates?: string[]
  topics?: string[]
  keywords?: string[]
}

interface GraphResponse {
  nodes: Array<{
    id: string
    position: {
      x: number
      y: number
    }
    data: MemoryNodeData
  }>

  edges: Array<{
    id: string
    source: string
    target: string
    label?: string
    animated?: boolean
    data?: {
      confidence?: number
      shared_entities?: string
    }
  }>
}

interface EdgeInspectorData {
  confidence?: number
  shared_entities?: string
  label?: string
}

function getNodeStyle(memoryType?: string) {
  const normalized = String(memoryType || '').toLowerCase()

  if (normalized.includes('receipt')) {
    return {
      border: '1px solid rgba(59,130,246,0.45)',
      background:
        'linear-gradient(145deg, rgba(30,41,59,0.97), rgba(15,23,42,0.97))',
      boxShadow: '0 16px 40px rgba(37,99,235,0.16)',
    }
  }

  if (normalized.includes('warranty')) {
    return {
      border: '1px solid rgba(168,85,247,0.45)',
      background:
        'linear-gradient(145deg, rgba(46,16,101,0.92), rgba(24,24,27,0.97))',
      boxShadow: '0 16px 40px rgba(126,34,206,0.16)',
    }
  }

  if (
    normalized.includes('lecture') ||
    normalized.includes('notes')
  ) {
    return {
      border: '1px solid rgba(16,185,129,0.45)',
      background:
        'linear-gradient(145deg, rgba(6,78,59,0.86), rgba(17,24,39,0.97))',
      boxShadow: '0 16px 40px rgba(5,150,105,0.14)',
    }
  }

  if (normalized.includes('personal')) {
    return {
      border: '1px solid rgba(245,158,11,0.4)',
      background:
        'linear-gradient(145deg, rgba(69,26,3,0.82), rgba(24,24,27,0.97))',
      boxShadow: '0 16px 40px rgba(217,119,6,0.14)',
    }
  }

  return {
    border: '1px solid rgba(148,163,184,0.35)',
    background:
      'linear-gradient(145deg, rgba(30,41,59,0.95), rgba(24,24,27,0.97))',
    boxShadow: '0 16px 40px rgba(15,23,42,0.22)',
  }
}

function getSourceIcon(sourceType?: string) {
  return String(sourceType || '').toLowerCase() === 'image'
    ? ImageIcon
    : FileText
}

export default function KnowledgeGraphPage() {
  const [nodes, setNodes, onNodesChange] =
    useNodesState<Node<FlowNodeData>>([])

  const [edges, setEdges, onEdgesChange] =
    useEdgesState<Edge>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const [selectedNode, setSelectedNode] =
    useState<MemoryNodeData | null>(null)

  const [edgeInfo, setEdgeInfo] =
    useState<EdgeInspectorData | null>(null)

  const loadGraph = useCallback(async () => {
    const token = localStorage.getItem('token')

    if (!token) {
      setError(
        'Your session has expired. Please log in again.'
      )
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')
      setSelectedNode(null)
      setEdgeInfo(null)

      const response: GraphResponse =
        await getMemoryGraph(token)

      const mappedNodes: Node<FlowNodeData>[] =
        response.nodes.map((node) => {
          const Icon = getSourceIcon(
            node.data.source_type
          )

          return {
            id: node.id,
            position: node.position,

            data: {
              ...node.data,

              originalLabel:
                node.data.label || 'Untitled memory',

              label: (
                <div className="w-[220px]">
                  <div className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/5">
                      <Icon className="size-4 text-primary" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">
                        {node.data.label ||
                          'Untitled memory'}
                      </p>

                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400">
                        {node.data.summary ||
                          'No summary available'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] text-slate-300">
                      {node.data.memory_type ||
                        'Memory'}
                    </span>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] ${
                        node.data.status === 'READY'
                          ? 'bg-emerald-500/10 text-emerald-300'
                          : 'bg-amber-500/10 text-amber-300'
                      }`}
                    >
                      {node.data.status || 'UNKNOWN'}
                    </span>
                  </div>
                </div>
              ),
            },

            style: {
              width: 250,
              borderRadius: 18,
              padding: 16,
              color: 'white',
              ...getNodeStyle(
                node.data.memory_type
              ),
            },
          }
        })

      const mappedEdges: Edge[] =
        response.edges.map((edge) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          label: edge.label || 'RELATED',
          animated: edge.animated ?? true,
          type: 'smoothstep',

          markerEnd: {
            type: MarkerType.ArrowClosed,
          },

          style: {
            strokeWidth: 2,
          },

          labelStyle: {
            fontSize: 11,
            fontWeight: 600,
          },

          data: edge.data,
        }))

      setNodes(mappedNodes)
      setEdges(mappedEdges)
    } catch (graphError) {
      console.error(graphError)
      setError(
        'Failed to load your memory graph.'
      )
    } finally {
      setLoading(false)
    }
  }, [setEdges, setNodes])

  useEffect(() => {
    loadGraph()
  }, [loadGraph])

  const visibleNodeIds = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return new Set(
        nodes.map((node) => node.id)
      )
    }

    return new Set(
      nodes
        .filter((node) => {
          const data = node.data

          const searchable = [
            data.originalLabel,
            data.memory_id,
            data.summary,
            data.memory_type,
            data.source_type,
            ...(data.products || []),
            ...(data.people || []),
            ...(data.organizations || []),
            ...(data.locations || []),
            ...(data.dates || []),
            ...(data.topics || []),
            ...(data.keywords || []),
          ]
            .join(' ')
            .toLowerCase()

          return searchable.includes(query)
        })
        .map((node) => node.id)
    )
  }, [nodes, search])

  const filteredNodes = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        hidden: !visibleNodeIds.has(node.id),
      })),
    [nodes, visibleNodeIds]
  )

  const filteredEdges = useMemo(
    () =>
      edges.map((edge) => ({
        ...edge,

        hidden:
          !visibleNodeIds.has(edge.source) ||
          !visibleNodeIds.has(edge.target),
      })),
    [edges, visibleNodeIds]
  )

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background */}

      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-background" />

        <div className="omni-float-one absolute -left-40 top-10 size-[480px] rounded-full bg-blue-500/20 blur-[130px]" />

        <div className="omni-float-two absolute right-[-160px] top-[18%] size-[440px] rounded-full bg-violet-500/20 blur-[130px]" />

        <div className="omni-float-three absolute bottom-[-160px] left-[40%] size-[420px] rounded-full bg-cyan-500/15 blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <main className="relative z-10 mx-auto max-w-[1500px] px-4 py-8 lg:px-8">
        {/* Page header */}

        <section className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <Badge
              variant="secondary"
              className="rounded-full border border-primary/15 bg-primary/5 px-3 py-1"
            >
              <Network className="mr-1.5 size-3.5 text-primary" />
              Connected intelligence
            </Badge>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
              Knowledge Graph
            </h1>

            <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
              Explore how your memories, purchases,
              documents and extracted entities connect.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Filter graph..."
                className="h-11 w-full rounded-xl border border-border/70 bg-background/70 pl-10 pr-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary/50 focus:ring-4 focus:ring-primary/10 sm:w-72"
              />
            </div>

            <Button
              variant="outline"
              className="h-11 rounded-xl"
              onClick={loadGraph}
              disabled={loading}
            >
              <RefreshCw
                className={`mr-2 size-4 ${
                  loading ? 'animate-spin' : ''
                }`}
              />

              Refresh
            </Button>
          </div>
        </section>

        {error && (
          <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="grid gap-5 xl:grid-cols-[1fr_330px]">
          {/* Graph */}

          <Card className="relative overflow-hidden border-border/60 bg-card/60 shadow-2xl backdrop-blur-xl">
            <CardHeader className="relative border-b border-border/60">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Brain className="size-5 text-primary" />
                    Memory network
                  </CardTitle>

                  <CardDescription className="mt-2">
                    Drag, zoom and click any node or
                    connection.
                  </CardDescription>
                </div>

                <div className="flex gap-2">
                  <Badge
                    variant="secondary"
                    className="rounded-full"
                  >
                    {nodes.length} nodes
                  </Badge>

                  <Badge
                    variant="outline"
                    className="rounded-full"
                  >
                    {edges.length} relations
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="relative h-[720px] p-0">
              {loading ? (
                <div className="flex h-full flex-col items-center justify-center">
                  <Loader2 className="size-8 animate-spin text-primary" />

                  <p className="mt-4 font-medium">
                    Building your knowledge graph...
                  </p>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Loading memories and relationships.
                  </p>
                </div>
              ) : nodes.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                  <span className="flex size-16 items-center justify-center rounded-3xl bg-primary/10">
                    <Network className="size-7 text-primary" />
                  </span>

                  <p className="mt-5 text-lg font-semibold">
                    No memories to visualize
                  </p>

                  <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                    Upload a few memories first.
                    Related memories will appear here
                    automatically.
                  </p>
                </div>
              ) : (
                <ReactFlow
                  nodes={filteredNodes}
                  edges={filteredEdges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onNodeClick={(_, node) => {
                    setSelectedNode(
                      responseDataFromNode(
                        node as Node<FlowNodeData>
                      )
                    )

                    setEdgeInfo(null)
                  }}
                  onEdgeClick={(_, edge) => {
                    setEdgeInfo({
                      confidence: Number(
                        edge.data?.confidence || 0
                      ),

                      shared_entities: String(
                        edge.data?.shared_entities || ''
                      ),

                      label: String(
                        edge.label || 'RELATED'
                      ),
                    })

                    setSelectedNode(null)
                  }}
                  fitView
                  fitViewOptions={{
                    padding: 0.2,
                  }}
                  minZoom={0.25}
                  maxZoom={1.8}
                  proOptions={{
                    hideAttribution: true,
                  }}
                >
                  <Background
                    gap={28}
                    size={1}
                  />

                  <MiniMap
                    pannable
                    zoomable
                    nodeColor={(node) => {
                      const memoryType = String(
                        node.data?.memory_type || ''
                      ).toLowerCase()

                      if (
                        memoryType.includes('receipt')
                      ) {
                        return '#3b82f6'
                      }

                      if (
                        memoryType.includes('warranty')
                      ) {
                        return '#a855f7'
                      }

                      if (
                        memoryType.includes('lecture')
                      ) {
                        return '#10b981'
                      }

                      return '#94a3b8'
                    }}
                  />

                  <Controls />
                </ReactFlow>
              )}
            </CardContent>
          </Card>

          {/* Inspector */}

          <aside className="space-y-5">
            <Card className="border-border/60 bg-card/60 shadow-xl backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg">
                  Graph inspector
                </CardTitle>

                <CardDescription>
                  Select a memory or relationship.
                </CardDescription>
              </CardHeader>

              <CardContent>
                {!selectedNode && !edgeInfo && (
                  <div className="rounded-2xl border border-dashed border-border/60 bg-background/40 p-6 text-center">
                    <Network className="mx-auto size-7 text-primary" />

                    <p className="mt-4 font-medium">
                      Nothing selected
                    </p>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Click a node to inspect its metadata
                      or click a connection to view
                      relationship details.
                    </p>
                  </div>
                )}

                {selectedNode && (
                  <div className="space-y-5">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                        Memory
                      </p>

                      <h2 className="mt-2 text-xl font-semibold">
                        {selectedNode.label}
                      </h2>

                      <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        {selectedNode.summary ||
                          'No summary available.'}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="secondary"
                        className="rounded-full"
                      >
                        {selectedNode.memory_type ||
                          'Memory'}
                      </Badge>

                      <Badge
                        variant="outline"
                        className="rounded-full"
                      >
                        {selectedNode.source_type ||
                          'text'}
                      </Badge>
                    </div>

                    <MetadataSection
                      title="Products"
                      items={selectedNode.products}
                    />

                    <MetadataSection
                      title="Organizations"
                      items={
                        selectedNode.organizations
                      }
                    />

                    <MetadataSection
                      title="People"
                      items={selectedNode.people}
                    />

                    <MetadataSection
                      title="Locations"
                      items={selectedNode.locations}
                    />

                    <MetadataSection
                      title="Dates"
                      items={selectedNode.dates}
                    />

                    <MetadataSection
                      title="Topics"
                      items={selectedNode.topics}
                    />

                    <MetadataSection
                      title="Keywords"
                      items={selectedNode.keywords}
                    />
                  </div>
                )}

                {edgeInfo && (
                  <div className="space-y-5">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                        Relationship
                      </p>

                      <h2 className="mt-2 text-xl font-semibold">
                        {edgeInfo.label || 'RELATED'}
                      </h2>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Confidence
                        </span>

                        <span className="font-semibold">
                          {(
                            Number(
                              edgeInfo.confidence || 0
                            ) * 100
                          ).toFixed(0)}
                          %
                        </span>
                      </div>

                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{
                            width: `${Math.max(
                              0,
                              Math.min(
                                Number(
                                  edgeInfo.confidence ||
                                    0
                                ) * 100,
                                100
                              )
                            )}%`,
                          }}
                        />
                      </div>
                    </div>

                    <MetadataSection
                      title="Shared entities"
                      items={String(
                        edgeInfo.shared_entities || ''
                      )
                        .split(',')
                        .map((item) => item.trim())
                        .filter(Boolean)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/60 shadow-xl backdrop-blur-xl">
              <CardContent className="p-5">
                <p className="font-medium">
                  Graph legend
                </p>

                <div className="mt-4 space-y-3 text-sm">
                  <LegendItem
                    label="Receipt"
                    className="bg-blue-500"
                  />

                  <LegendItem
                    label="Warranty"
                    className="bg-violet-500"
                  />

                  <LegendItem
                    label="Lecture notes"
                    className="bg-emerald-500"
                  />

                  <LegendItem
                    label="Other memory"
                    className="bg-slate-400"
                  />
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  )
}

function responseDataFromNode(
  node: Node<FlowNodeData>
): MemoryNodeData {
  const data = node.data

  return {
    memory_id: data.memory_id,
    label:
      data.originalLabel || 'Untitled memory',
    summary: data.summary,
    memory_type: data.memory_type,
    source_type: data.source_type,
    status: data.status,
    products: data.products,
    people: data.people,
    organizations: data.organizations,
    locations: data.locations,
    dates: data.dates,
    topics: data.topics,
    keywords: data.keywords,
  }
}

function MetadataSection({
  title,
  items,
}: {
  title: string
  items?: string[]
}) {
  if (!items || items.length === 0) {
    return null
  }

  const uniqueItems = Array.from(
    new Set(items)
  )

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </p>

      <div className="mt-2 flex flex-wrap gap-2">
        {uniqueItems.map((item) => (
          <Badge
            key={item}
            variant="outline"
            className="rounded-full"
          >
            {item}
          </Badge>
        ))}
      </div>
    </div>
  )
}

function LegendItem({
  label,
  className,
}: {
  label: string
  className: string
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`size-2.5 rounded-full ${className}`}
      />

      <span className="text-muted-foreground">
        {label}
      </span>
    </div>
  )
}