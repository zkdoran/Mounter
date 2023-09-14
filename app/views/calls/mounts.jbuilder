json.total_pages @mount_data.total_pages
json.next_page @mount_data.next_page

json.mounts do
  json.array! @mount_data.mounts do |mount|
    json.id mount.id
    json.name mount.name.en_US
  end
end