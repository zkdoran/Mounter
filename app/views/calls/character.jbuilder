json.character do
  json.id @character_data.id
  json.name @character_data.name
  json.realm @character_data.realm
  json.level @character_data.level
  json.achievement_points @character_data.achievement_points
  json.thumbnail @character_data.thumbnail
  json.mounts do
    json.array! @character_mounts.mounts do |mount|
      json.id mount.mount.id
      json.name mount.mount.name.en_US
      json.is_useable mount.is_useable
    end
  end
end