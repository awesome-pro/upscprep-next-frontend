<section className="container mx-auto py-10 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Courses</h1>
        {(userRole === UserRole.ADMIN || userRole === UserRole.TEACHER) && (
          <Button asChild>
            <Link href="/dashboard/courses/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Course
            </Link>
          </Button>
        )}
      </div>
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <Select value={courseType} onValueChange={setCourseType}>
          <SelectTrigger>
            <SelectValue placeholder="Course Type" />
          </SelectTrigger>
          <SelectContent>
            {courseTypeFilterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={subject} onValueChange={setSubject}>
          <SelectTrigger>
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            {subjectOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statusFilterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={premium} onValueChange={setPremium}>
          <SelectTrigger>
            <SelectValue placeholder="Premium" />
          </SelectTrigger>
          <SelectContent>
            {premiumFilterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Active filters display */}
      <div className="flex flex-wrap gap-2">
        {(debouncedSearchQuery || courseType !== "all" || subject !== "all" || status !== "all" || premium !== "all") && (
          <Button variant="outline" size="sm" onClick={resetFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>
      
      {/* Data Table */}
      <DataTable
        columns={columns}
        data={data}
        rowSelection={true}
        onRowSelectionChange={setRowSelection}
        isLoading={loading}
        additionalToolbarContent={()}
        defaultPageSize={10}
        onRefresh={fetchCourses}
        serverSideSearch={true}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchLoading={loading}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!courseToDelete} onOpenChange={(open) => !open && setCourseToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the course &quot;{courseToDelete?.title}&quot; and all its modules and lessons.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCourse} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>