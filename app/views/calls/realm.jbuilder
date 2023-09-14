json.realms do
  json.array! @realm_data.realms do |realm|
    json.id realm.id
    json.name realm.name
    json.slug realm.slug
  end