import { Layout } from "@/components/layout"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function ResourcesLoading() {
  return (
    <Layout>
      <div className="container px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-64" />
        </div>

        <div className="space-y-4">
          {/* Filters skeleton */}
          <div className="flex gap-2 mb-4">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-36" />
          </div>

          {/* Summary cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-5 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-2 w-full mb-4" />
                  <Skeleton className="h-4 w-48" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Chart skeleton */}
          <Card>
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="flex border-b mb-2">
                <div className="w-64 flex-shrink-0 p-2 border-r">
                  <Skeleton className="h-6 w-full" />
                </div>
                <div className="flex-1 flex">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="w-16 flex-shrink-0 p-1 border-r">
                      <Skeleton className="h-6 w-full" />
                    </div>
                  ))}
                </div>
              </div>

              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex border-b mb-2">
                  <div className="w-64 flex-shrink-0 p-2 border-r">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 flex">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <div key={j} className="w-16 h-16 flex-shrink-0 border-r">
                        <Skeleton className="h-full w-full opacity-20" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
